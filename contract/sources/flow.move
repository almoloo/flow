module flow_addr::flow {
    use std::string::{Self, String};
    use std::vector;
    use std::signer;
    use std::error;
    use aptos_framework::event;
    use aptos_std::table::{Self, Table};
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    use liquidswap::router_v2;
    use liquidswap::curves::Uncorrelated;
    use test_coins::coins::USDT as TestUSDT;
    use test_coins::coins::BTC;

    struct Vendor has key {
        owner: address,
        name: String,
        balance: u64,
        gateways: vector<Gateway>,
    }

    struct Gateway has store
    {
        id: u64,
        label: String,
        metadata: String,
        is_active: bool,
        payments: Table<u64, Payment>,
    }

    struct GatewayInfo has copy, drop, store {
        id: u64,
        label: String,
        metadata: String,
        is_active: bool,
    }

    struct Payment has store {
        id: u64,
        amount: u64,
        gateway_id: u64,
        withdrawn: bool,
    }

    #[event]
    struct VendorCreated has drop, store {
        owner: address,
        name: String,
    }

    #[event]
    struct PaymentEvent has drop, store {
        vendor_addr: address,
        payment_id: u64,
        gateway_id: u64,
        amount: u64,
    }

    // Error codes
    const E_GATEWAY_NOT_FOUND: u64 = 1;
    const E_NOT_OWNER: u64 = 2;

    const E_GATEWAY_NOT_ACTIVE: u64 = 3;
    const E_PAYMENT_ID_EXISTS: u64 = 4;
    const E_VENDOR_NOT_FOUND: u64 = 5;
    const E_VENDOR_NOT_REGISTERED: u64 = 6;
    const E_INVALID_TOKEN: u64 = 7;

    // ======================== Write functions ========================

    public entry fun init_vendor(sender: &signer, vendor_name: String) {

        let sender_addr = signer::address_of(sender);
        assert!(!exists<Vendor>(sender_addr), error::already_exists(1));
        
        let vendor = Vendor {
            owner: signer::address_of(sender),
            name: vendor_name,
            balance: 0,
            gateways: vector::empty<Gateway>(),
        };

        move_to(sender, vendor);

        if (!coin::is_account_registered<TestUSDT>(signer::address_of(sender))) {
            coin::register<TestUSDT>(sender);
        };

        event::emit(VendorCreated { owner: signer::address_of(sender), name: vendor_name });
    }

    public entry fun update_vendor_name(sender: &signer, new_name: String) acquires Vendor {
        let sender_addr = signer::address_of(sender);
        assert!(exists<Vendor>(sender_addr), error::not_found(0));
        let vendor = borrow_global_mut<Vendor>(sender_addr);
        vendor.name = new_name;
    }

    public entry fun add_gateway(
        sender: &signer,
        label: String,
        metadata: String ) 
        acquires Vendor {

        let sender_addr = signer::address_of(sender);
        let vendor = borrow_global_mut<Vendor>(sender_addr);
        let new_id = vendor.gateways.length() + 1;

        let gateway = Gateway {
            id: new_id,
            label,
            metadata,
            payments: table::new<u64, Payment>(),
            is_active: true,
        };

        vendor.gateways.push_back(gateway);
    }

    public entry fun update_gateway(
        sender: &signer,
        gateway_id: u64,
        new_label: String,
        new_metadata: String,
        is_active: bool
    ) acquires Vendor {
        let sender_addr = signer::address_of(sender);
        let vendor = borrow_global_mut<Vendor>(sender_addr);
        assert!(vendor.owner == sender_addr, error::permission_denied(E_NOT_OWNER));

        let len = vendor.gateways.length();
        let i = 0;
        let found = false;
        while (i < len) {
            let gw = vendor.gateways.borrow_mut(i);
            if (gw.id == gateway_id) {
                gw.label = new_label;
                gw.metadata = new_metadata;
                gw.is_active = is_active;
                found = true;
                break;
            };
            i += 1;
        };
        assert!(found, error::not_found(E_GATEWAY_NOT_FOUND));
    }

    public entry fun register_vendor(
        vendor: &signer
    ) {
        if (!coin::is_account_registered<TestUSDT>(signer::address_of(vendor))) {
            coin::register<TestUSDT>(vendor);
        };
    }
    
    public fun is_vendor_registered(vendor_addr: address): bool {
        coin::is_account_registered<TestUSDT>(vendor_addr)
    }

    public entry fun pay_to_vendor(
        sender: &signer,
        vendor_addr: address,
        gateway_id: u64,
        payment_id: u64,
        amount: u64
    ) acquires Vendor {
        assert!(exists<Vendor>(vendor_addr), error::not_found(E_VENDOR_NOT_FOUND));

        assert!(
            coin::is_account_registered<TestUSDT>(vendor_addr),
            error::invalid_state(E_VENDOR_NOT_REGISTERED)
        );

        let vendor = borrow_global_mut<Vendor>(vendor_addr);
        let len = vendor.gateways.length();
        let i = 0;
        let found = false;
        let gateway = &mut vendor.gateways;

        while (i < len) {
            let gw = gateway.borrow_mut(i);
            if (gw.id == gateway_id) {
                assert!(gw.is_active, error::invalid_state(E_GATEWAY_NOT_ACTIVE));
    
                assert!(!table::contains(&gw.payments, payment_id), error::already_exists(E_PAYMENT_ID_EXISTS));
                found = true;

                coin::transfer<TestUSDT>(sender, vendor_addr, amount);

                // Store payment
                let payment = Payment {
                    id: payment_id,
                    amount,
                    gateway_id,
                    withdrawn: false,
                };
                table::add(&mut gw.payments, payment_id, payment);

                // Update vendor balance
                vendor.balance += amount;

                // Emit event
                event::emit(PaymentEvent {
                    vendor_addr,
                    payment_id,
                    gateway_id,
                    amount,
                });
                break;
            };
            i += 1;
        };
        assert!(found, error::not_found(E_GATEWAY_NOT_FOUND));
    }

    // ======================= swipe ===========================
    public entry fun pay_to_vendor_apt(
        sender: &signer, 
        vendor_addr: address,
        gateway_id: u64,
        payment_id: u64,
        aptos_amount_to_swap: u64) acquires Vendor {

        assert!(exists<Vendor>(vendor_addr), error::not_found(E_VENDOR_NOT_FOUND));

        assert!(
            coin::is_account_registered<TestUSDT>(vendor_addr),
            error::invalid_state(E_VENDOR_NOT_REGISTERED)
        );

        let vendor = borrow_global_mut<Vendor>(vendor_addr);
        let len = vendor.gateways.length();
        let i = 0;
        let found = false;
        let gateway = &mut vendor.gateways;

        while (i < len) {
            let gw = gateway.borrow_mut(i);
            if (gw.id == gateway_id) {
                assert!(gw.is_active, error::invalid_state(E_GATEWAY_NOT_ACTIVE));
    
                assert!(!table::contains(&gw.payments, payment_id), error::already_exists(E_PAYMENT_ID_EXISTS));
                found = true;

                let aptos_coins_to_swap = coin::withdraw<AptosCoin>(sender, aptos_amount_to_swap);
                let usdt_amount_to_get = router_v2::get_amount_out<AptosCoin, TestUSDT, Uncorrelated>(
                    aptos_amount_to_swap,
                );

                let usdt = router_v2::swap_exact_coin_for_coin<AptosCoin, TestUSDT, Uncorrelated>(
                    aptos_coins_to_swap,
                    usdt_amount_to_get
                );

                // Store payment
                let payment = Payment {
                    id: payment_id,
                    amount: usdt_amount_to_get,
                    gateway_id,
                    withdrawn: false,
                };
                table::add(&mut gw.payments, payment_id, payment);

                // Update vendor balance
                vendor.balance += usdt_amount_to_get;
                coin::deposit(vendor_addr, usdt);

                // Emit event
                event::emit(PaymentEvent {
                    vendor_addr,
                    payment_id,
                    gateway_id,
                    amount: usdt_amount_to_get,
                });
                break;
            };
            i += 1;
        };
        assert!(found, error::not_found(E_GATEWAY_NOT_FOUND));   
    }

    public entry fun pay_to_vendor_token(
        sender: &signer, 
        vendor_addr: address,
        gateway_id: u64,
        payment_id: u64,
        token: String,
        coin_amount: u64,
    ) acquires Vendor {
        assert!(exists<Vendor>(vendor_addr), error::not_found(E_VENDOR_NOT_FOUND));

        assert!(
            coin::is_account_registered<TestUSDT>(vendor_addr),
            error::invalid_state(E_VENDOR_NOT_REGISTERED)
        );

        let vendor = borrow_global_mut<Vendor>(vendor_addr);
        let len = vendor.gateways.length();
        let i = 0;
        let found = false;
        let gateway = &mut vendor.gateways;

        while (i < len) {
            let gw = gateway.borrow_mut(i);
            if (gw.id == gateway_id) {
                assert!(gw.is_active, error::invalid_state(E_GATEWAY_NOT_ACTIVE));
    
                assert!(!table::contains(&gw.payments, payment_id), error::already_exists(E_PAYMENT_ID_EXISTS));
                found = true;
                
                let usdt;
                let usdt_amount_to_get;
                if (*string::bytes(&token) == *string::bytes(&string::utf8(b"APT")))
                {
                    let coins_to_swap = coin::withdraw<AptosCoin>(sender, coin_amount);
                    usdt_amount_to_get = router_v2::get_amount_out<AptosCoin, TestUSDT, Uncorrelated>(
                        coin_amount,
                    );

                    usdt = router_v2::swap_exact_coin_for_coin<AptosCoin, TestUSDT, Uncorrelated>(
                        coins_to_swap,
                        usdt_amount_to_get
                    );
                }
                else if (*string::bytes(&token) == *string::bytes(&string::utf8(b"BTC"))) {
                    let coins_to_swap = coin::withdraw<BTC>(sender, coin_amount);
                    usdt_amount_to_get = router_v2::get_amount_out<BTC, TestUSDT, Uncorrelated>(
                        coin_amount,
                    );

                    usdt = router_v2::swap_exact_coin_for_coin<BTC, TestUSDT, Uncorrelated>(
                        coins_to_swap,
                        usdt_amount_to_get
                    );
                }   
                else if (*string::bytes(&token) == *string::bytes(&string::utf8(b"USDT"))) {
                    usdt_amount_to_get = coin_amount;
                    usdt = coin::withdraw<TestUSDT>(sender, coin_amount);
                }
                else
                {
                    abort error::invalid_argument(E_INVALID_TOKEN) // Coin not found (unsupported token)
                }; 

                // Store payment
                let payment = Payment {
                    id: payment_id,
                    amount: usdt_amount_to_get,
                    gateway_id,
                    withdrawn: false,
                };
                table::add(&mut gw.payments, payment_id, payment);

                // Update vendor balance
                vendor.balance += usdt_amount_to_get;
                coin::deposit(vendor_addr, usdt);

                // Emit event
                event::emit(PaymentEvent {
                    vendor_addr,
                    payment_id,
                    gateway_id,
                    amount: usdt_amount_to_get,
                });
                break;
            };
            i += 1;
        };
        assert!(found, error::not_found(E_GATEWAY_NOT_FOUND));
    }

    public entry fun test_usdt(sender: &signer, vendor_addr: address, coin_amount: u64 )
    {
        let usdt = coin::withdraw<TestUSDT>(sender, coin_amount);
        coin::deposit(vendor_addr, usdt);
    }

    public entry fun test_usdt2(sender: &signer, vendor_addr: address, coin_amount: u64 )
    {
        coin::transfer<TestUSDT>(sender, vendor_addr, coin_amount);
    }

    // ======================== Read functions ========================
    #[view]
    public fun get_vendor_info(account: address): (address, String, u64, u64) acquires Vendor {
        let vendor = borrow_global<Vendor>(account);
        // Return: owner, name, balance, number of gateways
        (vendor.owner, vendor.name, vendor.balance, vendor.gateways.length())
    }

    #[view]
    public fun get_all_gateways(vendor_addr: address): vector<GatewayInfo> acquires Vendor {
        let vendor = borrow_global<Vendor>(vendor_addr);
        let result: vector<GatewayInfo> = vector::empty();

        let len = vendor.gateways.length();
        let i = 0;
        while (i < len) {
            let gw = vendor.gateways.borrow(i);
            let info = GatewayInfo {
                id: gw.id,
                label: gw.label,
                metadata: gw.metadata,
                is_active: gw.is_active,
            };
            result.push_back(info);
            i += 1;
        };

        result
    }

    #[view]
    public fun get_gateway_by_id(vendor_addr: address, gateway_id: u64): GatewayInfo acquires Vendor {
        let vendor = borrow_global<Vendor>(vendor_addr);
        let len = vendor.gateways.length();
        let i = 0;
        while (i < len) {
            let gw = vendor.gateways.borrow(i);
            if (gw.id == gateway_id) {
                return GatewayInfo {
                    id: gw.id,
                    label: gw.label,
                    metadata: gw.metadata,
                    is_active: gw.is_active,
                }
            };
            i += 1;
        };
        // If not found, abort
        abort E_GATEWAY_NOT_FOUND
    }

    // Getter functions for GatewayInfo
    public fun get_gateway_info_id(gw: &GatewayInfo): u64 {
        gw.id
    }

    public fun get_gateway_info_label(gw: &GatewayInfo): String {
        gw.label
    }

    public fun get_gateway_info_metadata(gw: &GatewayInfo): String {
        gw.metadata
    }

    public fun get_gateway_info_is_active(gw: &GatewayInfo): bool {
        gw.is_active
    }
}