module flow_addr::flow {
    use std::string::String;
    use std::vector;
    use std::signer;
    use std::error;
    use aptos_framework::event;

    #[event]
    struct VendorCreated has drop, store {
        owner: address,
        name: String,
    }

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
    }

    struct GatewayInfo has copy, drop, store {
        id: u64,
        label: String,
        metadata: String,
        is_active: bool,
    }

    // Error codes
    const E_GATEWAY_NOT_FOUND: u64 = 1;
    const E_NOT_OWNER: u64 = 2;

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