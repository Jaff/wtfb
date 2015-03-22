<?php
require "vendor/autoload.php";

// Use Twitter OAuth
use Abraham\TwitterOAuth\TwitterOAuth;

// Use Cache
$cache = new Cache();

// Erase Expired Caches before we start...
$cache->eraseExpired();

// Make Twitter Connection
$connection = new TwitterOAuth(
                    CONSUMER_KEY,
                    CONSUMER_SECRET,
                    $access_token,
                    $access_token_secret
                  );

// If there aren't statuses in the cache...
if (!($cache->isCached('statuses'))) {
  // Get Statuses from Twitter
  $statuses = $connection->get("statuses/user_timeline", ["screen_name" => "bandvomit", "count" => 200]);

  // Store Statuses
  $cache->store('statuses', $statuses, 300);
}

// Get Statuses from Cache
$statuses = $cache->retrieve('statuses');

if (!empty($statuses)) {
  // Make the response JSON
  header('Content-type: application/json');

  // Randomize Statuses - probably should be done on client side...
  // shuffle($statuses);

  // Encode JSON
  $statuses = json_encode($statuses);

  // Return statuses in JSON
  echo $statuses;
} else {
  // Send an error code
  header('HTTP', true, 500);
}

// if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
// } else {
//   // If not an ajax request - exit...
//   exit();
// }
