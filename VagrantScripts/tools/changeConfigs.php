<?PHP

use Magento\Framework\App\Bootstrap;
include_once('../magento/app/bootstrap.php');

$bootstrap = Bootstrap::create(BP, $_SERVER);

$objectManager = $bootstrap->getObjectManager();
$configInterface = $objectManager->get('\Magento\Framework\App\Config\ConfigResource\ConfigInterface');

// These settings change the way magentos own frontend works:
// # Use server rewrites (0->1) (removes index.php)
// # Remove suffixes from cat & product urls
$configInterface->saveConfig(
    "web/seo/use_rewrites",
    "1",
    \Magento\Framework\App\Config\ScopeConfigInterface::SCOPE_TYPE_DEFAULT,
    \Magento\Store\Model\Store::DEFAULT_STORE_ID
);

$configInterface->saveConfig(
    "catalog/seo/product_url_suffix",
    "",
    \Magento\Framework\App\Config\ScopeConfigInterface::SCOPE_TYPE_DEFAULT,
    \Magento\Store\Model\Store::DEFAULT_STORE_ID
);

$configInterface->saveConfig(
    "catalog/seo/category_url_suffix",
    "",
    \Magento\Framework\App\Config\ScopeConfigInterface::SCOPE_TYPE_DEFAULT,
    \Magento\Store\Model\Store::DEFAULT_STORE_ID
);

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
