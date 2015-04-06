<?php
// Autoload all the things!
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

// As long as there are Statuses...
if (!empty($statuses)) {
  // Make the response JSON
  header('Content-type: application/json');

  // Encode JSON
  $statuses = json_encode($statuses);

  // Return Statuses in JSON
  echo $statuses;
} else {
  // Send an error code
  header('HTTP', true, 500);
}