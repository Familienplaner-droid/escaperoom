# ci/

`debug.keystore` ist ein **reiner Test-Schlüssel** (Passwort `android`, Alias `androiddebugkey`, wie Androids Standard-Debug-Schlüssel).
Die CI signiert damit jede Test-APK. Weil der Schlüssel immer derselbe ist, lässt sich jede neue Test-Version
über die alte installieren, und der Spielstand bleibt erhalten.

Nicht für den Play Store verwenden – dafür gibt es einen eigenen, geheimen Upload-Schlüssel.
