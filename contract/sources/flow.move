module flow_addr::flow {
    use std::string::String;
    use std::vector;

    struct Vendor has key
    {
        name: String,
        getways: vector<Getway>,
    }

    struct Getway has key, store
    {
        owner: address,
        name: String,
        site: String,
    }

    // ======================== Write functions ========================

    public entry fun init_vendor(sender: &signer, vendor_name: String)
    {
        let vendor = Vendor {
            name: vendor_name,
            getways: vector::empty(),
        };
        move_to(sender, vendor);
    }

}