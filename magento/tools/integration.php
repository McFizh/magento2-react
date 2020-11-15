<?PHP

// https://magento.stackexchange.com/questions/130567/magento-2-programmatically-create-activate-and-authorize-a-new-integration#130807

use Magento\Framework\App\Bootstrap;
include_once('/var/www/html/app/bootstrap.php');

$bootstrap = Bootstrap::create(BP, $_SERVER);
$objectManager = $bootstrap->getObjectManager();

// Code to create Integration
try{
	$integrationFactory = $objectManager->get('Magento\Integration\Model\IntegrationFactory')->create();
	$integration = $integrationFactory->setData(
		array(
			'name' => 'Magento 2 front',
			'status' => '1',
			'setup_type' => '0'
		)
	);

	$integration->save();
	$integrationId = $integration->getId();
	$consumerName = 'Integration' . $integrationId;

	// Code to create consumer
	$oauthService = $objectManager->get('Magento\Integration\Model\OauthService');
	$consumer = $oauthService->createConsumer(['name' => $consumerName]);
	$consumerId = $consumer->getId();
	$integration->setConsumerId($consumer->getId());
	$integration->save();

	// Code to grant permission
	$authrizeService = $objectManager->get('Magento\Integration\Model\AuthorizationService');
	$authrizeService->grantAllPermissions($integrationId);

	// Code to Activate and Authorize
	$token = $objectManager->get('Magento\Integration\Model\Oauth\Token');
	$uri = $token->createVerifierToken($consumerId);
	$token->setType('access');
	$token->save();

} catch(Exception $e) {
	echo 'Error : '.$e->getMessage();
	die();
}

//
$oauthService = $objectManager->get('Magento\Integration\Model\OauthService');
$consumer = $oauthService->loadConsumer($consumerId)->getData();
$token = $oauthService->getAccessToken($consumerId)->getData();

file_put_contents("/tmp/config.json", "
{
  \"consumerKey\": \"${consumer['key']}\",
  \"consumerSecret\": \"${consumer['secret']}\",
  \"token\": \"${token['token']}\",
  \"tokenSecret\": \"${token['secret']}\"
}
");
