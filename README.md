# Volagal bot
 volagal discord bot

# How to config

the bot expect to find a config.json file answering to this syntax at the root of the package :

{"BOT_PROPERTIES":{
    "TOKEN": "Your Token Here",
    "CONSOLE_INFO":"VOLABOT Info >",
    "CONSOLE_WARN":"VOLABOT Warn >",
    "CONSOLE_ERROR":"VOLABOT ERROR >"
}}

# Whitelist config

the bot expect to find a server.json file answering to this syntax at the root of the package :

{
    
        "server_name":{
        "Name":"server name",
        "IP":"server ip",
        "PORT":"server rcon port",
        "TCP":"boolean for tcp",
        "Password":"rcon password"
        }
}