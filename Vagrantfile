Vagrant.configure(2) do |config|
    config.vm.box = "centos/7"
    config.vm.provision :shell, path: "VagrantScripts/base.sh"
    config.vm.network "forwarded_port", guest: 3000, host: 3000
    config.vm.network "forwarded_port", guest: 90, host: 3090
    config.vm.network "forwarded_port", guest: 80, host: 3080

    config.vm.provider "vmware_fusion" do |v|
        v.vmx["memsize"] = "3072"
        v.vmx["numvcpus"] = "4"
    end

    config.vm.provider "libvirt" do |v|
        v.cpus = 4
        v.memory = 3072
    end

end

