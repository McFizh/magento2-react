<?PHP

use Magento\Framework\App\Bootstrap;
include_once('../magento/app/bootstrap.php');

$bootstrap = Bootstrap::create(BP, $_SERVER);

$objectManager = $bootstrap->getObjectManager();
$configInterface = $objectManager->get('\Magento\Framework\App\Config\ConfigResource\ConfigInterface');

// Enable elasticsearch engine
/*
$configInterface->saveConfig(
    "catalog/search/engine",
    "elasticsearch",
    \Magento\Framework\App\Config\ScopeConfigInterface::SCOPE_TYPE_DEFAULT,
    \Magento\Store\Model\Store::DEFAULT_STORE_ID
);
*/

// These lines do nothing atm (well you can use them to debug this script, but other than that..nothing :)
/*
// Flush cache to make changes stick (otherwise getValue returns the old value)
$cacheManager = $objectManager->get('\Magento\Framework\App\Cache\Manager');
$cacheManager->flush($cacheManager->getAvailableTypes());

$scopeConfig = $objectManager->get('\Magento\Framework\App\Config\ScopeConfigInterface');
$value = $scopeConfig->getValue("web/seo/use_rewrites");
 */
