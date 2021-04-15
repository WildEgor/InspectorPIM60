## Sopas Cam Web Interface (React)

This is an updated implementation of the part of rendering content from the Sopas PIM60 and sending commands.

**Here full documentation:**
[![forthebadge made-with-javascript](http://ForTheBadge.com/images/badges/made-with-javascript.svg)](https://github.com/WildEgor/InspectorPIM60/tree/main/docs)

Todo list:
 - [x] Show current live images with statistics. Change properties (*ShowOverlay*, *SimplifiedOverlay*, *HideOverlay*);
 - [x] Show logged images with timestamp (inner logger and prog);
 - [x] Ability to change reference images and some tools settings.

**Instance info**

**Available commands:**

| Command | Description |
| --- | --- |
| `gVER` | Get protocol version that is supported by the addressed device |
| `sMOD [mode]` | Set device mode (0 = Run, 1 = Edit) |
| `sINT [identifier] [arg1] [arg2]…[argN]` | Set “integer” parameter in the device |
| `gINT [identifier] [arg1] [arg2]…[argN]` | Get “integer” parameter from the device |
| `gSTR [identifier] [arg1] [arg2]` | Get "string" parameter from device |
| `aACT [identifier] [arg1] [arg2]…[argN]` | Action commands |
| `TRIG` | Trig an image acquisition and analysis |
| `gRES` | Retrieve the latest available Ethernet Result Output string |
| `gSTAT` | Retrieve the latest statistics from the device |

**Available response:**

| Response | Description |
| --- | --- |
| `rgVER [errorCode] [protocolVersion]` | Response to protocol version including the version that is supported by the device |
| `rsMOD [errorCode] [errorMessage]` | Response to set mode (Run/Edit) including error code and error message |
| `rgMOD [errorCode] [mode] [errorMessage]` | Response to fetch current mode (Run/Edit) including the mode, error code, and error message |
| `rsINT [identifier] [errorCode] [errorMessage]` | Response to set integer parameter and action commands including error code and error message |
| `rgINT [identifier] [errorCode] [ret1] [ret2] ...[retN] [errorMessage]` | Response to fetch integer parameter including parameter value, error code and error message |
| `raACT [identifier] [errorCode] [errorMessage]` | Response to the action command including error code and error message |
| `rTRIG [errorCode] [errorMessage]` | Response to the trig command including error code and error message |
| `rgSTR [identifier] [errorCode] [errorMessage/nameString]` | Response to the get string command. If errorCode is 0 (No error) the errorMessage is instead the actual response string |
| `rgRES [errorCode] [errorMessage/resultString]` | Response to the get latest available Ethernet Result Output string. If errorCode is 0 (No error) the errorMessage is instead the actual Ethernet Result Output string |
| `rgSTAT [statistics in XML format]` | Response to get the latest statistics from the device in XML format |

If returned errorCode is 0 no errorMessage will be shown. For explanation of errorCode and
errorMessage see Section B.4, “Error codes” (page 74).
The response message is a receipt that the command is valid and is executed on the Inspector.
However, the following commands take longer time to execute, and may not have finished
executing when you receive the command response:
• All action commands (aACT)
• Select reference object (sINT 1)
• Set mode (sMOD)

Example URL
The successful execution of the following command
http://192.168.1.110/CmdChannel?sINT_1_1
will perform the command (to select reference object with index 1) and then return the following
string:
rsINT 1 0
while a failed command may return:
rsINT 1 8101 Ref bank index is not used.

Available settings for PIM60 (see above for supported syntax).
The Web API supports using the command channel for reading and updating parts of the
device configuration.
The Web API also supports the functionality to do a backup of the device configuration to a
file and to restore the configuration again. This is a convenient way to handle configurations
without installing and using SOPAS Engineering Tool (ET).

The command channel has a set of basic principles:
• Only one command at a time can be executed.
• Inspector PIM60 responds to each command with a response that includes the result of
the command as well as error codes.
• A specific task to control the Inspector PIM60 includes the command together with its
parameters, see list of command types and parameters in Appendix B, “Command channel”
(page 52).
• Writing a parameter can typically only be done when the device is in Edit mode. Reading
a parameter can be done in both Edit and Run mode.
• It is possible to block configuration changes by deselecting Allow changes via Web Server in
the Web Server tab in the dialog Interfaces and I/O Settings in InspectorPIM60 menu.

Backup configuration
The URL to export a configuration is http://<IP-address>/backup_config?config1
The result of the request is an .spb file containing the device configuration. This file can be
stored in the file system of the receiving unit and used later in the restore procedure.
The Web Server standard(!) web pages requires a login to perform a backup. A login is not required
when doing a backup through the Web API.
Restore configuration
The operation may take several minutes and the Inspector PIM60 is automatically restarted
after the configuration has been transferred to the Inspector PIM60.

(see page 54)
| Command | Description |
| --- | --- |
| `gSTAT` | Retrieve the latest statistics from the device |
| `gSTAT` | Retrieve the latest statistics from the device |
