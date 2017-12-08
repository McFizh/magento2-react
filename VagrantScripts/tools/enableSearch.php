<?PHP

use Magento\Framework\App\Bootstrap;
include_once('../magento/app/bootstrap.php');

$bootstrap = Bootstrap::create(BP, $_SERVER);

$objectManager = $bootstrap->getObjectManager();
$configInterface = $objectManager->get('\Magento\Framework\App\Config\ConfigResource\ConfigInterface');
$cacheManager = $objectManager->get('\Magento\Framework\App\Cache\Manager');

$configInterface->saveConfig(
	"catalog/search/engine",
	"elasticsearch",
        \Magento\Framework\App\Config\ScopeConfigInterface::SCOPE_TYPE_DEFAULT, 
        \Magento\Store\Model\Store::DEFAULT_STORE_ID
);

$cacheManager->flush($cacheManager->getAvailableTypes());

// These lines do nothing atm (well you can use them to debug this script, but other than that..nothing :)
$scopeConfig = $objectManager->get('\Magento\Framework\App\Config\ScopeConfigInterface');
$value = $scopeConfig->getValue("catalog/search/engine");
