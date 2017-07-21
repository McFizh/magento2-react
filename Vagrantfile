Vagrant.configure(2) do |config|
    config.vm.box = "centos/7"
    config.vm.provision :shell, path: "VagrantScripts/base.sh"
    config.vm.network "forwarded_port", guest: 3000, host: 3000
    config.vm.network "forwarded_port", guest: 90, host: 3090
    config.vm.network "forwarded_port", guest: 80, host: 3080

    config.vm.provider "vmware_fusion" do |v|
        v.vmx["memsize"] = "2048"
        v.vmx["numvcpus"] = "2"
    end

end

