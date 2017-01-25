echo "mysql"
humble up -d mysql

sleep 10

echo "hubs-info"
humble up -d hubs-info

sleep 10

echo "free-bikes"
humble up -d free-bikes

sleep 10

echo "hubs"
humble up -d hubs

sleep 10

echo "pms"
humble up -d pma

humble logs -f
