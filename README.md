# ledger

A site to view data about 

1. the top 100 cards players stats, including bank, deck value and more. All data is sortable either descending or ascending.
2. living status of legendaries

New data is generated every 1 AM PST and previously generated ones can be searched and viewed.

Why 1 AM PST? I have a repo generating the data needed for the cte checker running at midnight PST based off NS nation dumps which should be made at 10:30 PST, this offset is to ensure they exist.

Why doesn't that repo also just run the script after so it is guaranteed to exist?
Great question!!!