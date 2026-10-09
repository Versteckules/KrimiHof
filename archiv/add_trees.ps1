$path = 'data/story.json'
$jsonStr = Get-Content -Raw $path -Encoding UTF8
$obj = $jsonStr | ConvertFrom-Json

$obj.dialogueTrees | Add-Member -MemberType NoteProperty -Name 'hauptpost' -Value @(
    @{ id = "start"; speaker = "Gepäckträger"; avatar = "assets/passant.jpg"; text = "Guten Abend... suchen Sie jemanden? Die letzten Züge sind schon durch."; choices = @( @{ text = "Haben Sie heute Abend etwas Verdächtiges beobachtet?"; next = "q1" }, @{ text = "Ich suche nach Beweisen im Fall Renger."; next = "q2" } ) },
    @{ id = "q1"; speaker = "Gepäckträger"; avatar = "assets/passant.jpg"; text = "Verdächtig? Naja, es war einiges los. Mehrere Leute hasteten aus Richtung Altstadt hierher."; choices = @(
        @{ text = "Dem Gepäckträger das Fahndungsfoto von Valentin Herold zeigen"; next = "ans_herold"; impact = @{ suspect = "herold"; value = 5 } },
        @{ text = "Nach einer Dame im teuren Wintermantel fragen (Katharina von Gipser)"; next = "ans_gipser"; impact = @{ suspect = "gipser"; value = 5 } },
        @{ text = "Nach einem Mann in schwarzer Kutte mit Notenmappe forschen (Severin Heiden)"; next = "ans_heiden"; impact = @{ suspect = "heiden"; value = 5 } }
    ) },
    @{ id = "q2"; speaker = "Gepäckträger"; avatar = "assets/passant.jpg"; text = "Beweise? Oha. Also hier lassen die Leute oft Dinge liegen, wenn sie es eilig haben."; choices = @(
        @{ text = "Dem Gepäckträger das Fahndungsfoto von Valentin Herold zeigen"; next = "ans_herold"; impact = @{ suspect = "herold"; value = 5 } },
        @{ text = "Nach einer Dame im teuren Wintermantel fragen (Katharina von Gipser)"; next = "ans_gipser"; impact = @{ suspect = "gipser"; value = 5 } },
        @{ text = "Nach einem Mann in schwarzer Kutte mit Notenmappe forschen (Severin Heiden)"; next = "ans_heiden"; impact = @{ suspect = "heiden"; value = 5 } }
    ) },
    @{ id = "ans_herold"; speaker = "Gepäckträger"; avatar = "assets/passant.jpg"; text = "Ja! Der Kerl rannte fast in mich rein! Er verlor dabei dieses Foto. Ein Polaroid vom Bahnhof... sieht aus wie Vorbereitung für eine Flucht!"; isEnd = $true; unlockSuspects = $true },
    @{ id = "ans_gipser"; speaker = "Gepäckträger"; avatar = "assets/passant.jpg"; text = "Eine Dame im Pelzmantel? Die habe ich gesehen. Sie zerriss panisch ein Dokument und warf es in den Müll... moment, ich hab das Polaroid hier gefunden. Vielleicht gehört es ihr?"; isEnd = $true; unlockSuspects = $true },
    @{ id = "ans_heiden"; speaker = "Gepäckträger"; avatar = "assets/passant.jpg"; text = "Ein Kuttenträger? Der schlich am Schließfach vorbei. Kurz danach lag dieses Polaroid auf dem Boden."; isEnd = $true; unlockSuspects = $true }
)

$obj.dialogueTrees | Add-Member -MemberType NoteProperty -Name 'obelisk' -Value @(
    @{ id = "start"; speaker = "Informantin"; avatar = "assets/informantin.jpg"; text = "Pst... {PLAYER_NAME}. Hier drüben im Schatten. Ich habe Unterlagen, die Rengers Recherchen belegen."; choices = @( @{ text = "Was haben Sie herausgefunden?"; next = "q1" }, @{ text = "Sind Sie sicher, dass wir hier ungestört sind?"; next = "q2" } ) },
    @{ id = "q1"; speaker = "Informantin"; avatar = "assets/informantin.jpg"; text = "Ein geheimer Schuldschein. Verschlüsselt! Renger war einer großen Sache auf der Spur. Die Schlappen-Erben existieren!"; choices = @(
        @{ text = "Das riecht nach Herolds illegalen Auktionen!"; next = "ans_ob"; impact = @{ suspect = "herold"; value = 5 } },
        @{ text = "Gipser nutzt solche Stiftungen zur Geldwäsche!"; next = "ans_ob"; impact = @{ suspect = "gipser"; value = 5 } },
        @{ text = "Sicherlich eine religiöse Spende an Heidens Extremisten!"; next = "ans_ob"; impact = @{ suspect = "heiden"; value = 5 } }
    ) },
    @{ id = "q2"; speaker = "Informantin"; avatar = "assets/informantin.jpg"; text = "Niemand ist hier sicher. Der Brand im Rathaus war erst der Anfang. Sehen Sie sich das an: Ein verschlüsselter Schuldschein aus Rengers Tresor."; choices = @(
        @{ text = "Das riecht nach Herolds illegalen Auktionen!"; next = "ans_ob"; impact = @{ suspect = "herold"; value = 5 } },
        @{ text = "Gipser nutzt solche Stiftungen zur Geldwäsche!"; next = "ans_ob"; impact = @{ suspect = "gipser"; value = 5 } },
        @{ text = "Sicherlich eine religiöse Spende an Heidens Extremisten!"; next = "ans_ob"; impact = @{ suspect = "heiden"; value = 5 } }
    ) },
    @{ id = "ans_ob"; speaker = "Informantin"; avatar = "assets/informantin.jpg"; text = "Ihre Theorie ist riskant, {PLAYER_NAME}. Nehmen Sie den Beweis und finden Sie den Code zur Entschlüsselung!"; isEnd = $true }
)

$obj.dialogueTrees | Add-Member -MemberType NoteProperty -Name 'lorenzkirche' -Value @(
    @{ id = "start"; speaker = "Küster Franz"; avatar = "assets/kuester_franz.jpg"; text = "Haben Sie gesehen, wie die Flammen am Rathaus lodern? Wie damals 1823... die Prophezeiung erfüllt sich."; choices = @( @{ text = "Prophezeiung? Wer redet denn von so etwas?"; next = "q1" }, @{ text = "Glauben Sie wirklich an diesen Fluch?"; next = "q1" } ) },
    @{ id = "q1"; speaker = "Küster Franz"; avatar = "assets/kuester_franz.jpg"; text = "Die alten Schriften, mein Freund. Hier in der Sakristei fand ich dieses versiegelte Dokument. Es betrifft die Grundstücke der Rosina-Stiftung."; choices = @(
        @{ text = "Herold könnte diese Papiere für den Schwarzmarkt gestohlen haben."; next = "ans_lor"; impact = @{ suspect = "herold"; value = 5 } },
        @{ text = "Die Grundstücke? Das betrifft Frau von Gipsers Baufirma direkt!"; next = "ans_lor"; impact = @{ suspect = "gipser"; value = 5 } },
        @{ text = "Oder Heiden wollte sie aus dogmatischen Gründen vernichten."; next = "ans_lor"; impact = @{ suspect = "heiden"; value = 5 } }
    ) },
    @{ id = "ans_lor"; speaker = "Küster Franz"; avatar = "assets/kuester_franz.jpg"; text = "Möge Gott uns beistehen. Nehmen Sie die Akte. Ich wasche meine Hände in Unschuld."; isEnd = $true }
)

$obj.dialogueTrees | Add-Member -MemberType NoteProperty -Name 'karolinenstrasse' -Value @(
    @{ id = "start"; speaker = "Passant (Telefonzelle)"; avatar = "assets/passant.jpg"; text = "Erschrecken Sie mich nicht so! Ich dachte, Sie sind der Mann, der gerade telefonierend vorbeigerannt ist."; choices = @( @{ text = "Ein flüchtiger Mann? Wie sah er aus?"; next = "q1" }, @{ text = "Haben Sie gehört, was er gesagt hat?"; next = "q1" } ) },
    @{ id = "q1"; speaker = "Passant (Telefonzelle)"; avatar = "assets/passant.jpg"; text = "Er rief etwas in den Hörer und hat dann wütend aufgelegt. Dabei ist ihm dieser gravierte Ring aus der Tasche gefallen."; choices = @(
        @{ text = "Das ist ein Ablenkungsmanöver von Herold!"; next = "ans_kar"; impact = @{ suspect = "herold"; value = 5 } },
        @{ text = "Ein Kontaktmann von Gipsers Bau-Mafia?"; next = "ans_kar"; impact = @{ suspect = "gipser"; value = 5 } },
        @{ text = "Religiöse Chiffren... Heidens Helfer!"; next = "ans_kar"; impact = @{ suspect = "heiden"; value = 5 } }
    ) },
    @{ id = "ans_kar"; speaker = "Passant (Telefonzelle)"; avatar = "assets/passant.jpg"; text = "Behalten Sie den Ring. Ich will damit nichts zu tun haben!"; isEnd = $true }
)

$obj.dialogueTrees | Add-Member -MemberType NoteProperty -Name 'marienkirche' -Value @(
    @{ id = "start"; speaker = "Chorsängerin Helene"; avatar = "assets/helene.jpg"; text = "Gottlob, jemand Offizielles! Ich habe Stimmen hinter dem Beichtstuhl gehört... ein heftiger Streit!"; choices = @( @{ text = "Haben Sie den Streit heimlich aufgezeichnet?"; next = "q1" }, @{ text = "Konnten Sie die Personen erkennen?"; next = "q2" } ) },
    @{ id = "q1"; speaker = "Chorsängerin Helene"; avatar = "assets/helene.jpg"; text = "Ja, ich drückte schnell den Aufnahmeknopf meines Diktiergeräts. Es ging um ein geheimes Ambigramm!"; choices = @(
        @{ text = "Bestimmt ging es um Herolds Schmuggelware."; next = "ans_mar"; impact = @{ suspect = "herold"; value = 5 } },
        @{ text = "Frau von Gipser wurde bei Absprachen ertappt."; next = "ans_mar"; impact = @{ suspect = "gipser"; value = 5 } },
        @{ text = "Heidens verbotene Logen-Treffen!"; next = "ans_mar"; impact = @{ suspect = "heiden"; value = 5 } }
    ) },
    @{ id = "q2"; speaker = "Chorsängerin Helene"; avatar = "assets/helene.jpg"; text = "Nein, es war zu dunkel. Aber ich habe heimlich mein Diktiergerät laufen lassen. Es ging um ein okkultes Ambigramm!"; choices = @(
        @{ text = "Bestimmt ging es um Herolds Schmuggelware."; next = "ans_mar"; impact = @{ suspect = "herold"; value = 5 } },
        @{ text = "Frau von Gipser wurde bei Absprachen ertappt."; next = "ans_mar"; impact = @{ suspect = "gipser"; value = 5 } },
        @{ text = "Heidens verbotene Logen-Treffen!"; next = "ans_mar"; impact = @{ suspect = "heiden"; value = 5 } }
    ) },
    @{ id = "ans_mar"; speaker = "Chorsängerin Helene"; avatar = "assets/helene.jpg"; text = "Wer auch immer es war... ihre Machenschaften dürfen das Gotteshaus nicht beschmutzen. Nehmen Sie das Band!"; isEnd = $true }
)

$obj.dialogueTrees | Add-Member -MemberType NoteProperty -Name 'michaeliskirche' -Value @(
    @{ id = "start"; speaker = "Gehilfe"; avatar = "assets/gehilfe.jpg"; text = "Sie sind der Ermittler, richtig? Ich habe im Glockenturm ein Kryptorad gefunden. Völlig verdreckt."; choices = @( @{ text = "Im Turm? Das ist ungewöhnlich."; next = "q1" }, @{ text = "Haben Sie daran gedreht?"; next = "q1" } ) },
    @{ id = "q1"; speaker = "Gehilfe"; avatar = "assets/gehilfe.jpg"; text = "Ich wage es nicht anzufassen. Es könnte den Schlappen-Erben gehören. Man munkelt, Renger war kurz vor seinem Verschwinden hier."; choices = @(
        @{ text = "Herold nutzt den Turm als Schmuggelversteck!"; next = "ans_mic"; impact = @{ suspect = "herold"; value = 5 } },
        @{ text = "Gipsers 'Sanierungsspenden' dienten dem Zugang!"; next = "ans_mic"; impact = @{ suspect = "gipser"; value = 5 } },
        @{ text = "Heiden hat hier oben die Geheimbund-Rituale abgehalten!"; next = "ans_mic"; impact = @{ suspect = "heiden"; value = 5 } }
    ) },
    @{ id = "ans_mic"; speaker = "Gehilfe"; avatar = "assets/gehilfe.jpg"; text = "Bitte decken Sie diese dunklen Geheimnisse auf. Ich übergebe Ihnen den Beweis."; isEnd = $true }
)

$obj.dialogueTrees | Add-Member -MemberType NoteProperty -Name 'hospitalkirche' -Value @(
    @{ id = "start"; speaker = "Flussschiffer"; avatar = "assets/flussschiffer.jpg"; text = "Ahoi, Ermittler. Der Fluss flüstert von dunklen Machenschaften heute Nacht. Eine zerrissene Gründungsurkunde trieb im Wasser."; choices = @( @{ text = "Eine Urkunde? Ist sie lesbar?"; next = "q1" }, @{ text = "Wer hat sie in die Saale geworfen?"; next = "q1" } ) },
    @{ id = "q1"; speaker = "Flussschiffer"; avatar = "assets/flussschiffer.jpg"; text = "Ich konnte sie trocknen. Es geht um die historische Satzung von 1432! Jemand wollte diesen Beweis vernichten."; choices = @(
        @{ text = "Herolds Hehlerboot ankert bestimmt in der Nähe."; next = "ans_hos"; impact = @{ suspect = "herold"; value = 5 } },
        @{ text = "Gipser hat Schmiergelder gezahlt, um das zu vertuschen."; next = "ans_hos"; impact = @{ suspect = "gipser"; value = 5 } },
        @{ text = "Heidens sakrales Ritual am Flussufer!"; next = "ans_hos"; impact = @{ suspect = "heiden"; value = 5 } }
    ) },
    @{ id = "ans_hos"; speaker = "Flussschiffer"; avatar = "assets/flussschiffer.jpg"; text = "Nehmt sie, bevor der Nebel sie wieder verschlingt. Die Wahrheit darf nicht ertrinken."; isEnd = $true }
)

# Convert back to JSON
$jsonOut = ConvertTo-Json -InputObject $obj -Depth 100
$jsonOut | Set-Content -Path $path -Encoding UTF8
