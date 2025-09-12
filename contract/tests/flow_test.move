#[test_only]
module flow_addr::flow_test {
    use std::signer;
    use std::string;
    use flow_addr::flow;

    #[test(alice = @0x001)]
    fun init_vendor_test(alice: &signer) {
        flow::init_vendor(alice, string::utf8(b"TestVendor"));
        let (owner, name, balance, gateways_len) = flow::get_vendor_info(signer::address_of(alice));
        assert!(owner == signer::address_of(alice), 1);
        assert!(name == string::utf8(b"TestVendor"), 2);
        assert!(balance == 0, 3);
        assert!(gateways_len == 0, 4);
    }

    #[test(bob = @0x002)]
    fun add_and_update_gateway_test(bob: &signer) {
        // Initialize vendor
        flow::init_vendor(bob, string::utf8(b"BobVendor"));

        // Add gateways
        flow::add_gateway(bob, string::utf8(b"MyGateway1"), string::utf8(b"Metadata1"));
        flow::add_gateway(bob, string::utf8(b"MyGateway2"), string::utf8(b"Metadata2"));

        // Update vendor name
        flow::update_vendor_name(bob, string::utf8(b"UpdatedVendor"));

        // Update first gateway
        flow::update_gateway(
            bob,
            1,
            string::utf8(b"UpdatedGateway1"),
            string::utf8(b"UpdatedMetadata1"),
            false // Deactivate
        );

        // Fetch vendor info
        let (owner, name, balance, gateways_len) = flow::get_vendor_info(signer::address_of(bob));
        assert!(owner == signer::address_of(bob), 10);
        assert!(name == string::utf8(b"UpdatedVendor"), 11);
        assert!(balance == 0, 12);
        assert!(gateways_len == 2, 13);

        // Fetch all gateways
        let all_gateways = flow::get_all_gateways(signer::address_of(bob));
        let len = all_gateways.length();
        assert!(len == 2, 14);

        // Check first gateway (updated)
        let gw1 = all_gateways.borrow(0);
        assert!(flow::get_gateway_info_id(gw1) == 1, 15);
        assert!(flow::get_gateway_info_label(gw1) == string::utf8(b"UpdatedGateway1"), 16);
        assert!(flow::get_gateway_info_metadata(gw1) == string::utf8(b"UpdatedMetadata1"), 17);
        assert!(flow::get_gateway_info_is_active(gw1) == false, 18);

        // Check second gateway (unchanged)
        let gw2 = all_gateways.borrow(1);
        assert!(flow::get_gateway_info_id(gw2) == 2, 19);
        assert!(flow::get_gateway_info_label(gw2) == string::utf8(b"MyGateway2"), 20);
        assert!(flow::get_gateway_info_metadata(gw2) == string::utf8(b"Metadata2"), 21);
        assert!(flow::get_gateway_info_is_active(gw2) == true, 22);

        let singleGw2 = flow::get_gateway_by_id(signer::address_of(bob), 2);
        assert!(flow::get_gateway_info_id(&singleGw2) == 2, 19);
        assert!(flow::get_gateway_info_label(&singleGw2) == string::utf8(b"MyGateway2"), 20);
        assert!(flow::get_gateway_info_metadata(&singleGw2) == string::utf8(b"Metadata2"), 21);
        assert!(flow::get_gateway_info_is_active(&singleGw2) == true, 22);
    }

    #[test(bob = @0x002)]
    #[expected_failure(abort_code = 0x60001)] // E_GATEWAY_NOT_FOUND
    fun update_gateway_not_found_fails(bob: &signer) {
        flow::init_vendor(bob, string::utf8(b"BobVendor"));
        flow::update_gateway(
            bob,
            999, // Non-existent ID
            string::utf8(b"Invalid"),
            string::utf8(b"Invalid"),
            false
        );
    }
}