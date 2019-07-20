<div align='center'>

# CustomBotJS - A Discord Bot for PUBG Custom Game organization

Originally for /r/PUBATTLEGROUNDS aka PUBGReddit

Based on [CustomsBot](https://github.com/Samwalton9/CustomsBot) by SamWalton.

[![CodeFactor](https://img.shields.io/codefactor/grade/github/danbennettuk/custombotjs.svg?style=for-the-badge)](https://www.codefactor.io/repository/github/danbennettuk/custombotjs)
[![Depfu](https://img.shields.io/depfu/DanBennettUK/CustomBotJS.svg?style=for-the-badge)](https://depfu.com/github/DanBennettUK/CustomBotJS?project_id=8443)
[![GitHub release](https://img.shields.io/github/release/DanBennettUK/CustomBotJS.svg?style=for-the-badge)](https://github.com/DanBennettUK/CustomBotJS/releases)
[![Buy Me A Beer](https://img.shields.io/badge/donate-buy%20me%20a%20beer-orange.svg?style=for-the-badge)](https://www.buymeacoffee.com/danbennett)
[![Twitter](https://img.shields.io/twitter/follow/DanBennett.svg?color=blue&style=for-the-badge)](https://www.twitter.com/danbennett)

<div align="center">
    <img src="./botlogo.png" />
</div>
</div>

## 📋 Requirements:

These are the required libraries/packages to run this bot:

-   [Node](https://nodejs.org/en/)
-   [Discord.JS](https://discord.js.org)
-   [PM2](http://pm2.keymetrics.io/) (optional)

## 🔧 Configure:

This table outlines what the configuration settings are in `config.json`.

| Config Option                  |                                      Description                                       |                            Example                            |
| ------------------------------ | :------------------------------------------------------------------------------------: | :-----------------------------------------------------------: |
| `token`                        |                                   Discord Bot Token                                    | `N345798SDG98NBDSFGLKHlh4.8sdglh.dfg8oe4lkndf_dhg0934sg2qevM` |
| `prefix`                       |                                     Command Prefix                                     |                              `$`                              |
| `host_channel_id`              |                         ID token of the hosts Discord channel                          |                       `40972350972635`                        |
| `games_channel_id`             |        ID token of the Discord channel where votes and passwords will be posted        |                       `40972350972635`                        |
| `chat_channel_id`              |                   ID token of the Discord channel used for chatting                    |                       `40972350972635`                        |
| `subscriber_channel_id`        |               ID token of the Discord channel used for subscribers only                |                       `40972350972635`                        |
| `host_role_id`                 |                           ID token of the hosts Discord role                           |                       `40972350972635`                        |
| `custom_role_id`               |                ID token of the Custom games Discord role for mentioning                |                       `40972350972635`                        |
| `bot_role_id`                  |                     ID token of the bot so it knows it's identity                      |                       `40972350972635`                        |
| `subscriber_role_id`           |    ID token of the Subscribers Discord role for mentioning separate to normal users    |                       `40972350972635`                        |
| `role_message_id`              |           ID of the message used to add or remove roles via reaction clicks            |                       `40972350972635`                        |
| `voice_channel_emoji`          | Emoji that voice channels start with, for the bot to set user limit for with `vclimit` |                       `40972350972635`                        |
| `default_timer`                |                       Default time in minutes for timers to use                        |                              `2`                              |
| `activity => twitch_client_id` |                       Twitch API key for checking Twitch status                        |                            `false`                            |
| `activity => twitchUsername`   |                  Twitch Username for the bot to check when streaming                   |                         `DanBennett`                          |
| `activity => message`          |                   Default activity message to use when not streaming                   |                `PlayerUnknown's BattleGrounds`                |
| `default_game_server_name`     |       Default Custom Game Server Name (can be overridden by `password` command)        |                            `true`                             |
| `default_game_server_password` |     Default Custom Game Server Password (can be overridden by `password` command)      |                            `true`                             |
| `host_channel_messages`        |            Choose whether results of votes are posted in the hosts channel             |                            `true`                             |
| `custom_role_ping`             |   Choose whether the Custom role set by `custom_role_id` should be pinged/mentioned    |                            `true`                             |
| `debug_enable`                 |                       Enable or Disable debugging (false = off)                        |                            `false`                            |

## 🚀 Usage:

```shell
$ node . # I'll script this later..
```

## 📄 License:

GPL-3.0 © [Dan Bennett](https://github.com/DanBennettUK/CustomBotJS/blob/master/LICENSE)
