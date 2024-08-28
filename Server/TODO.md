Database stuff way later
maybe just use redis the pg stuff was a nightmare and not really documented
do not use orm just do sql easier to manage
schema validator?

res.setHeader('Content-Type', 'application/json');

This is an HTTP form. NOT a Json payload. If done correctly, it should have request Content-Type application/x-www-form-urlencoded
