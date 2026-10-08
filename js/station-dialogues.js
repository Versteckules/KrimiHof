export const stationDialogueTrees = {
  "hauptpost": [
    {
      "id": "start",
      "speaker": "Gepäckträger",
      "avatar": "assets/passant.jpg",
      "text": "Guten Abend... suchen Sie jemanden? Die letzten Züge sind schon durch. Ich wollte gerade abschließen.",
      "choices": [
        { "text": "[Subtil] Nur ein Abendspaziergang. Ist es normal, dass hier noch Licht brennt?", "next": "subtil_1" },
        { "text": "[Direkt] Kommissar Stahl. Ich verfolge eine Spur im Fall Renger.", "next": "direkt_1" },
        { "text": "[Aggressiv] Halt! Keiner verlässt den Bahnhof. Taschenkontrolle!", "next": "aggressiv_1" }
      ]
    },
    {
      "id": "subtil_1",
      "speaker": "Gepäckträger",
      "avatar": "assets/passant.jpg",
      "text": "Normal? In dieser Stadt ist nichts normal. Vor einer halben Stunde stürmte jemand durch die Halle, als wäre der Teufel hinter ihm her.",
      "choices": [
        { "text": "Haben Sie sein Gesicht erkannt?", "next": "gesicht" },
        { "text": "Hat er etwas fallen lassen?", "next": "fallen_lassen" }
      ]
    },
    {
      "id": "direkt_1",
      "speaker": "Gepäckträger",
      "avatar": "assets/passant.jpg",
      "text": "Fall Renger? Davon stand was in der Zeitung. Aber ich halte mich aus sowas raus. Zu gefährlich.",
      "choices": [
        { "text": "[Überreden] Wenn Sie schweigen, machen Sie sich mitschuldig.", "next": "aggressiv_2" },
        { "text": "[Empathie] Ich verstehe Ihre Angst. Aber jeder noch so kleine Hinweis rettet Leben.", "next": "gesicht" }
      ]
    },
    {
      "id": "aggressiv_1",
      "speaker": "Gepäckträger",
      "avatar": "assets/passant.jpg",
      "text": "Was fällt Ihnen ein?! Ich arbeite hier seit 20 Jahren und lasse mich nicht wie einen Kriminellen behandeln!",
      "choices": [
        { "text": "[Einlenken] Entschuldigung. Meine Nerven liegen blank.", "next": "direkt_1" },
        { "text": "[Druck erhöhen] Kriminelle haben keine Dienstjahre. Was haben Sie gesehen?!", "next": "fail_1" }
      ]
    },
    {
      "id": "fail_1",
      "speaker": "Gepäckträger",
      "avatar": "assets/passant.jpg",
      "text": "Reicht mir jetzt! Verschwinden Sie, oder ich rufe den Bahnhofsvorsteher. Ich sage kein Wort mehr!",
      "isEnd": true
    },
    {
      "id": "gesicht",
      "speaker": "Gepäckträger",
      "avatar": "assets/passant.jpg",
      "text": "Sein Gesicht war im Schatten eines Mantelkragens verborgen. Aber... er hinkte leicht. Und er fluchte über eine 'verschwundene Lieferung'.",
      "choices": [
        { "text": "[Beweis vorzeigen] 'Lieferung'? Das klingt nach Valentin Herolds Schmuggelnetzwerk!", "next": "success_herold", "impact": {"suspect": "herold", "value": 10} },
        { "text": "Könnte es eine Frau im Pelzmantel gewesen sein? (Gipser)", "next": "widerspruch_1" },
        { "text": "War es ein religiöser Fanatiker in Kutte? (Heiden)", "next": "widerspruch_1" }
      ]
    },
    {
      "id": "widerspruch_1",
      "speaker": "Gepäckträger",
      "avatar": "assets/passant.jpg",
      "text": "Eine Frau? Fanatiker? Machen Sie Witze? Ich sagte doch, es war ein breitschultriger Kerl mit Mantel! Hören Sie mir überhaupt zu?",
      "choices": [
        { "text": "Mein Fehler. Was ist dann passiert?", "next": "fallen_lassen" },
        { "text": "Vielleicht war es eine Täuschung.", "next": "fail_2" }
      ]
    },
    {
      "id": "fail_2",
      "speaker": "Gepäckträger",
      "avatar": "assets/passant.jpg",
      "text": "Sie haben doch den Verstand verloren. Ich schließe jetzt ab. Suchen Sie Ihre 'Täuschung' woanders.",
      "isEnd": true
    },
    {
      "id": "fallen_lassen",
      "speaker": "Gepäckträger",
      "avatar": "assets/passant.jpg",
      "text": "Als er gegen den Gepäckwagen stieß, ist ihm etwas aus der Tasche gerutscht. Ein seltsames Polaroid. Sehen Sie selbst nach, liegt dort hinten.",
      "isEnd": true,
      "unlockSuspects": true
    },
    {
      "id": "success_herold",
      "speaker": "Gepäckträger",
      "avatar": "assets/passant.jpg",
      "text": "Herold? Der reiche Schnösel? Könnte passen. Der Mantel sah jedenfalls teuer aus. Und schauen Sie mal, dort hinten hat er ein Polaroid verloren, als er stolperte.",
      "isEnd": true,
      "unlockSuspects": true
    },
    {
      "id": "aggressiv_2",
      "speaker": "Gepäckträger",
      "avatar": "assets/passant.jpg",
      "text": "Mitschuldig?! Pff. Wissen Sie was? Suchen Sie Ihren Kram alleine. Er ist Richtung Schließfächer gerannt und hat ein Bild fallen lassen. Mehr weiß ich nicht!",
      "isEnd": true,
      "unlockSuspects": true
    }
  ],
  "obelisk": [
    {
      "id": "start",
      "speaker": "Informantin",
      "avatar": "assets/informantin.jpg",
      "text": "Pst... {PLAYER_NAME}. Hier drüben im Schatten. Spielen Sie mit Ihrem Mantelknopf, tun Sie so, als würden wir uns nicht kennen.",
      "choices": [
        { "text": "[Subtil] Schönes Wetter heute... haben Sie die Dokumente?", "next": "subtil_1" },
        { "text": "[Direkt] Lassen Sie das Theater. Was haben Sie herausgefunden?", "next": "direkt_1" },
        { "text": "[Vorsichtig] Ist uns jemand gefolgt? Sie wirken nervös.", "next": "vorsichtig_1" }
      ]
    },
    {
      "id": "subtil_1",
      "speaker": "Informantin",
      "avatar": "assets/informantin.jpg",
      "text": "Wetter? Es braut sich ein Sturm zusammen. Rengers Recherchen waren ein Wespennest. Die historische Schlappen-Stiftung wird für Geldwäsche missbraucht.",
      "choices": [
        { "text": "Wer zieht die Fäden?", "next": "fragen" },
        { "text": "[Beweis] Das passt perfekt zu Helene von Gipsers Baukonsortium!", "next": "success_gipser", "impact": {"suspect": "gipser", "value": 10} }
      ]
    },
    {
      "id": "direkt_1",
      "speaker": "Informantin",
      "avatar": "assets/informantin.jpg",
      "text": "Theater? Sie kapieren den Ernst der Lage nicht. Der Brand im Rathaus war eine Warnung. Jemand vernichtet Beweise zur Rosina-Stiftung.",
      "choices": [
        { "text": "Die Rosina-Stiftung? War Renger da involviert?", "next": "fragen" },
        { "text": "[Beweis] Herolds Auktionen laufen über solche Stiftungen!", "next": "widerspruch_1", "impact": {"suspect": "herold", "value": -5} }
      ]
    },
    {
      "id": "vorsichtig_1",
      "speaker": "Informantin",
      "avatar": "assets/informantin.jpg",
      "text": "Ich schlafe seit Tagen nicht mehr. Jedes Auto klingt wie ein Mordkommando. Renger war einer riesigen Geldwäsche auf der Spur.",
      "choices": [
        { "text": "Beruhigen Sie sich. Wer steckt dahinter?", "next": "fragen" },
        { "text": "[Aggressiv] Sie sind paranoid. Geben Sie mir einfach die Akten.", "next": "fail_1" }
      ]
    },
    {
      "id": "fail_1",
      "speaker": "Informantin",
      "avatar": "assets/informantin.jpg",
      "text": "Paranoid?! Sie arroganter Narr. Wenn Sie das nicht ernst nehmen, sind Sie ein toter Mann. Ich bin raus!",
      "isEnd": true
    },
    {
      "id": "fragen",
      "speaker": "Informantin",
      "avatar": "assets/informantin.jpg",
      "text": "Ich kenne keine Namen. Aber hier ist ein verschlüsselter Schuldschein, den ich aus Rengers Tresor retten konnte. Die Zahlenkolonnen sind kryptisch.",
      "choices": [
        { "text": "[Analysieren] Das sieht aus wie eine doppelte Buchführung der Bau-Mafia. (Gipser)", "next": "success_gipser", "impact": {"suspect": "gipser", "value": 10} },
        { "text": "Eine theologische Geheimsprache der Bruderschaft? (Heiden)", "next": "widerspruch_2" },
        { "text": "Geben Sie her, ich entschlüssele das.", "next": "geben" }
      ]
    },
    {
      "id": "widerspruch_1",
      "speaker": "Informantin",
      "avatar": "assets/informantin.jpg",
      "text": "Herold? Schmarrn! Auktionen laufen nicht über historische Stiftungs-Grundstücke. Das ist Immobiliengeschäft, reiner Beton!",
      "choices": [
        { "text": "Verstehe. Also Gipsers Revier.", "next": "success_gipser", "impact": {"suspect": "gipser", "value": 5} },
        { "text": "Dann zeigen Sie mir, was Sie haben.", "next": "geben" }
      ]
    },
    {
      "id": "widerspruch_2",
      "speaker": "Informantin",
      "avatar": "assets/informantin.jpg",
      "text": "Bruderschaft? Das sind Kontoauszüge, keine Gebetsbücher! Sind Sie überhaupt der brillante Ermittler, für den man Sie hält?",
      "choices": [
        { "text": "Ein Irrtum. Geben Sie mir den Zettel.", "next": "geben" }
      ]
    },
    {
      "id": "success_gipser",
      "speaker": "Informantin",
      "avatar": "assets/informantin.jpg",
      "text": "Gipser! Natürlich... die Sanierungsprojekte in der Altstadt sind der perfekte Deckmantel für so ein Volumen. Clever, {PLAYER_NAME}. Nehmen Sie den Schuldschein und knacken Sie den Code!",
      "isEnd": true,
      "unlockSuspects": true
    },
    {
      "id": "geben",
      "speaker": "Informantin",
      "avatar": "assets/informantin.jpg",
      "text": "Hier. Aber beeilen Sie sich. Renger hat sein Leben dafür gelassen, dieser Zettel ist gefährlich.",
      "isEnd": true
    }
  ],
  "lorenzkirche": [
    {
      "id": "start",
      "speaker": "Küster Franz",
      "avatar": "assets/kuester_franz.jpg",
      "text": "Haben Sie gesehen, wie die Flammen am Rathaus loderten? Wie damals beim großen Brand... die Sünden der Stadt holen uns ein.",
      "choices": [
        { "text": "[Empathie] Eine Tragödie. Haben Sie Trost in der Schrift gefunden?", "next": "empathie_1" },
        { "text": "[Pragmatisch] Das war Brandstiftung, kein göttlicher Zorn.", "next": "pragmatisch_1" },
        { "text": "[Aggressiv] Sparen Sie sich die Predigt. Was wissen Sie über Renger?", "next": "aggressiv_1" }
      ]
    },
    {
      "id": "empathie_1",
      "speaker": "Küster Franz",
      "avatar": "assets/kuester_franz.jpg",
      "text": "Trost... ja. Aber Renger kam neulich extrem aufgewühlt hierher. Er suchte nach dem alten Testament der Rosina-Stiftung in unseren Archiven.",
      "choices": [
        { "text": "Hat er es gefunden?", "next": "archiv_1" },
        { "text": "Warum interessierte er sich für die Kirche?", "next": "archiv_1" }
      ]
    },
    {
      "id": "pragmatisch_1",
      "speaker": "Küster Franz",
      "avatar": "assets/kuester_franz.jpg",
      "text": "Vielleicht beides? Der Teufel wirkt oft durch irdisches Feuer. Ein Mann namens Heiden hat letzte Woche stundenlang die alten Statuen untersucht.",
      "choices": [
        { "text": "Heiden? Der Sektierer? Was wollte er hier?", "next": "heiden_1" },
        { "text": "[Beweis] Passt zu den religiösen Chiffren, die wir gefunden haben!", "next": "success_heiden", "impact": {"suspect": "heiden", "value": 10} }
      ]
    },
    {
      "id": "aggressiv_1",
      "speaker": "Küster Franz",
      "avatar": "assets/kuester_franz.jpg",
      "text": "Solch ein barscher Ton im Hause des Herrn! Ich bin niemandem Rechenschaft schuldig, schon gar nicht jemandem ohne Manieren.",
      "choices": [
        { "text": "Verzeihen Sie, der Fall raubt mir den Schlaf.", "next": "empathie_1" },
        { "text": "Ich brauche keine Manieren, ich brauche Fakten!", "next": "fail_1" }
      ]
    },
    {
      "id": "fail_1",
      "speaker": "Küster Franz",
      "avatar": "assets/kuester_franz.jpg",
      "text": "Dann suchen Sie diese Fakten auf der Straße. Gehen Sie mit Gott, aber gehen Sie.",
      "isEnd": true
    },
    {
      "id": "archiv_1",
      "speaker": "Küster Franz",
      "avatar": "assets/kuester_franz.jpg",
      "text": "Er fand Hinweise, dass jemand die alten Kirchenschriften nutzt, um Geheimbotschaften zu senden. Ein kryptischer Musik-Code. Ich habe hier Notenblätter gefunden, die nicht ins Gesangbuch gehören.",
      "choices": [
        { "text": "[Beweis] Musik-Code? Das ist die Handschrift von Magnus Heiden!", "next": "success_heiden", "impact": {"suspect": "heiden", "value": 10} },
        { "text": "Herold schmuggelt Noten?", "next": "widerspruch_1" },
        { "text": "Lassen Sie mich die Noten sehen.", "next": "noten" }
      ]
    },
    {
      "id": "heiden_1",
      "speaker": "Küster Franz",
      "avatar": "assets/kuester_franz.jpg",
      "text": "Er suchte nach dem Rhythmus der Vergebung, sagte er. Kurz danach fand ich diese manipulierten Notenblätter auf der Kirchenbank.",
      "choices": [
        { "text": "Zeigen Sie mir die Blätter.", "next": "noten" },
        { "text": "Eindeutig Heidens Werk. Er nutzt die Orgel als Chiffre.", "next": "success_heiden", "impact": {"suspect": "heiden", "value": 10} }
      ]
    },
    {
      "id": "widerspruch_1",
      "speaker": "Küster Franz",
      "avatar": "assets/kuester_franz.jpg",
      "text": "Der Kunsthändler Herold? Nein, nein, diese Blätter sind neu. Sie strotzen vor religiösem Fanatismus, nicht vor Profitgier. Sie irren sich.",
      "choices": [
        { "text": "Dann zeigen Sie mir die Noten.", "next": "noten" }
      ]
    },
    {
      "id": "success_heiden",
      "speaker": "Küster Franz",
      "avatar": "assets/kuester_franz.jpg",
      "text": "Ja... Magnus Heiden. Sein Fanatismus kennt keine Grenzen. Er glaubt, die alten Noten bergen göttliche Geheimnisse. Nehmen Sie die Papiere, vielleicht können Sie die Melodie entschlüsseln.",
      "isEnd": true,
      "unlockSuspects": true
    },
    {
      "id": "noten",
      "speaker": "Küster Franz",
      "avatar": "assets/kuester_franz.jpg",
      "text": "Möge Gott Ihren Verstand erhellen. Hier sind die Notenblätter. Sie ergeben musikalisch keinen Sinn, es muss ein Kryptogramm sein.",
      "isEnd": true
    }
  ],
  "karolinenstrasse": [
    {
      "id": "start",
      "speaker": "Passant",
      "avatar": "assets/passant.jpg",
      "text": "Erschrecken Sie mich nicht so! Ich dachte für eine Sekunde, Sie sind dieser Verrückte, der gerade telefonierend vorbeigerannt ist.",
      "choices": [
        { "text": "[Subtil] Alles in Ordnung? Sie zittern ja.", "next": "subtil_1" },
        { "text": "[Direkt] Wo ist er hingelaufen? Wie sah er aus?", "next": "direkt_1" },
        { "text": "[Aggressiv] Aus dem Weg, wo ging der Typ hin?!", "next": "aggressiv_1" }
      ]
    },
    {
      "id": "subtil_1",
      "speaker": "Passant",
      "avatar": "assets/passant.jpg",
      "text": "Danke, es geht schon. Er war riesig, trug eine dunkle Kutte und redete ununterbrochen von einer 'Reinigung' in ein Walkie-Talkie.",
      "choices": [
        { "text": "[Beweis] 'Reinigung'? Das klingt wie das Manifest von Heiden!", "next": "success_heiden", "impact": {"suspect": "heiden", "value": 10} },
        { "text": "Kutte? Vielleicht eine Mode von Gipsers Haute-Couture Freunden?", "next": "widerspruch_1" },
        { "text": "Hat er etwas fallengelassen?", "next": "fallen_1" }
      ]
    },
    {
      "id": "direkt_1",
      "speaker": "Passant",
      "avatar": "assets/passant.jpg",
      "text": "Richtung Burg! Er rief in sein Gerät: 'Das Feuer war das Signal! Die Sünder werden brennen!'.",
      "choices": [
        { "text": "[Beweis] Eine religiöse Wahnvorstellung. Magnus Heiden!", "next": "success_heiden", "impact": {"suspect": "heiden", "value": 10} },
        { "text": "Feuer? Herold vernichtet Beweise seiner Kunstfälschungen!", "next": "widerspruch_1" }
      ]
    },
    {
      "id": "aggressiv_1",
      "speaker": "Passant",
      "avatar": "assets/passant.jpg",
      "text": "Hören Sie auf, mich anzuschreien! Das ist ja schlimmer als in Filmen. Wissen Sie was? Finden Sie es selbst heraus!",
      "choices": [
        { "text": "[Entschuldigen] Tut mir leid. Wir müssen ihn fassen.", "next": "direkt_1" },
        { "text": "[Ignorieren] Vergessen Sie es.", "next": "fail_1" }
      ]
    },
    {
      "id": "fail_1",
      "speaker": "Passant",
      "avatar": "assets/passant.jpg",
      "text": "Spinner gibt es heute echt an jeder Ecke...",
      "isEnd": true
    },
    {
      "id": "widerspruch_1",
      "speaker": "Passant",
      "avatar": "assets/passant.jpg",
      "text": "Was? Nein! Der sprach wie ein Prediger, nicht wie ein Geschäftsmann oder Modedesigner! Völlig fanatisch.",
      "choices": [
        { "text": "Also ein religiöser Fanatiker.", "next": "fallen_1" }
      ]
    },
    {
      "id": "success_heiden",
      "speaker": "Passant",
      "avatar": "assets/passant.jpg",
      "text": "Heiden? Ja, so nannte man ihn in den Nachrichten! Er rempelte mich an und dabei fiel ihm dieser seltsame Ring mit Buchstaben aus der Tasche.",
      "isEnd": true,
      "unlockSuspects": true
    },
    {
      "id": "fallen_1",
      "speaker": "Passant",
      "avatar": "assets/passant.jpg",
      "text": "Als er um die Ecke bog, polterte etwas auf das Pflaster. Ein schwerer Ring mit verdrehbaren Ringen. Nehmen Sie ihn.",
      "isEnd": true
    }
  ],
  "marienkirche": [
    {
      "id": "start",
      "speaker": "Chorsängerin Helene",
      "avatar": "assets/helene.jpg",
      "text": "Gottlob, jemand Offizielles! Ich habe mich im Beichtstuhl versteckt. Draußen fand ein konspiratives Treffen statt!",
      "choices": [
        { "text": "[Subtil] Keine Angst, Sie sind in Sicherheit. Wer war da?", "next": "subtil_1" },
        { "text": "[Analytisch] Ein Treffen in der Kirche? Um diese Uhrzeit?", "next": "direkt_1" },
        { "text": "[Kritisch] Und was haben Sie um Mitternacht im Beichtstuhl zu suchen?", "next": "kritisch_1" }
      ]
    },
    {
      "id": "kritisch_1",
      "speaker": "Chorsängerin Helene",
      "avatar": "assets/helene.jpg",
      "text": "Wie können Sie es wagen! Ich habe Blumen arrangiert. Wenn Sie mich verhören wollen, wende ich mich an jemand anderen!",
      "choices": [
        { "text": "Beruhigen Sie sich, es war nur eine Frage.", "next": "direkt_1" },
        { "text": "Gut, dann behalten Sie Ihr Geheimnis.", "next": "fail_1" }
      ]
    },
    {
      "id": "fail_1",
      "speaker": "Chorsängerin Helene",
      "avatar": "assets/helene.jpg",
      "text": "Unverschämtheit! Ich werde mich beim Dekan beschweren.",
      "isEnd": true
    },
    {
      "id": "subtil_1",
      "speaker": "Chorsängerin Helene",
      "avatar": "assets/helene.jpg",
      "text": "Zwei feine Herren. Sie stritten über verschwundene Antiquitäten aus der Stiftungs-Sammlung. Einer nannte den anderen einen Halsabschneider.",
      "choices": [
        { "text": "Antiquitäten? Das klingt stark nach Valentin Herold.", "next": "success_herold", "impact": {"suspect": "herold", "value": 10} },
        { "text": "Ging es vielleicht um Baupläne? (Gipser)", "next": "widerspruch_1" },
        { "text": "Haben Sie mehr verstanden?", "next": "band" }
      ]
    },
    {
      "id": "direkt_1",
      "speaker": "Chorsängerin Helene",
      "avatar": "assets/helene.jpg",
      "text": "Ja! Es ging um Schwarzmarkthandel. Die alten Reliquien der Kirche werden systematisch durch Fälschungen ersetzt und teuer verkauft!",
      "choices": [
        { "text": "[Beweis] Kunstraub und Fälschungen? Das ist die Spezialität von Valentin Herold!", "next": "success_herold", "impact": {"suspect": "herold", "value": 10} },
        { "text": "Ist Heiden so fanatisch, dass er Reliquien stiehlt?", "next": "widerspruch_1" },
        { "text": "Gibt es Beweise für dieses Gespräch?", "next": "band" }
      ]
    },
    {
      "id": "widerspruch_1",
      "speaker": "Chorsängerin Helene",
      "avatar": "assets/helene.jpg",
      "text": "Baupläne? Heiden? Nein, die sprachen über eine Ming-Vase und alte Pergamente! Hören Sie schlecht?",
      "choices": [
        { "text": "Haben Sie das Gespräch aufgezeichnet?", "next": "band" }
      ]
    },
    {
      "id": "success_herold",
      "speaker": "Chorsängerin Helene",
      "avatar": "assets/helene.jpg",
      "text": "Herold, ja! So wurde er genannt! 'Valentin, Sie treiben es zu weit', sagte die andere Stimme. Zum Glück habe ich heimlich mein Diktiergerät mitlaufen lassen.",
      "isEnd": true,
      "unlockSuspects": true
    },
    {
      "id": "band",
      "speaker": "Chorsängerin Helene",
      "avatar": "assets/helene.jpg",
      "text": "Ich habe gedankenschnell mein Diktiergerät eingeschaltet. Die Aufnahme ist verrauscht, man muss die Nebengeräusche filtern. Hier, bitte.",
      "isEnd": true
    }
  ],
  "michaeliskirche": [
    {
      "id": "start",
      "speaker": "Gehilfe",
      "avatar": "assets/gehilfe.jpg",
      "text": "Sie sind der Ermittler, richtig? Gut, dass Sie hier sind. Ich traue mich nicht mehr in den Glockenturm.",
      "choices": [
        { "text": "[Subtil] Was hat Sie so erschreckt, junger Mann?", "next": "subtil_1" },
        { "text": "[Direkt] Was ist im Turm passiert?", "next": "direkt_1" },
        { "text": "[Skeptisch] Geistergeschichten? Dafür habe ich keine Zeit.", "next": "skeptisch_1" }
      ]
    },
    {
      "id": "subtil_1",
      "speaker": "Gehilfe",
      "avatar": "assets/gehilfe.jpg",
      "text": "Jemand hat das alte mechanische Kryptorad an der großen Glocke manipuliert. Und überall lagen seltsame Tarot-Karten.",
      "choices": [
        { "text": "Tarot-Karten? Eindeutig der Sektenführer Heiden!", "next": "success_heiden", "impact": {"suspect": "heiden", "value": 10} },
        { "text": "Gipser betreibt Wahrsagerei?", "next": "widerspruch_1" },
        { "text": "Führen Sie mich zu dem Rad.", "next": "rad" }
      ]
    },
    {
      "id": "direkt_1",
      "speaker": "Gehilfe",
      "avatar": "assets/gehilfe.jpg",
      "text": "Das alte Kryptorad aus dem 15. Jahrhundert. Es ist normalerweise verriegelt, aber jemand hat es aufgebrochen und einen Code eingegeben.",
      "choices": [
        { "text": "[Beweis] Okkulte Symbole und alte Kryptographie... Das trägt Magnus Heidens Handschrift!", "next": "success_heiden", "impact": {"suspect": "heiden", "value": 10} },
        { "text": "Herold sucht Antiquitäten!", "next": "widerspruch_2" },
        { "text": "Ich muss mir das Rad ansehen.", "next": "rad" }
      ]
    },
    {
      "id": "skeptisch_1",
      "speaker": "Gehilfe",
      "avatar": "assets/gehilfe.jpg",
      "text": "Geister? Ich spreche von handfestem Vandalismus! Wenn Sie Ihren Job nicht ernst nehmen, rufe ich die Schutzpolizei.",
      "choices": [
        { "text": "Schon gut, zeigen Sie mir, was passiert ist.", "next": "direkt_1" },
        { "text": "Tun Sie das.", "next": "fail_1" }
      ]
    },
    {
      "id": "fail_1",
      "speaker": "Gehilfe",
      "avatar": "assets/gehilfe.jpg",
      "text": "Inkompetenz, unfassbar...",
      "isEnd": true
    },
    {
      "id": "widerspruch_1",
      "speaker": "Gehilfe",
      "avatar": "assets/gehilfe.jpg",
      "text": "Gipser? Die Bauunternehmerin? Warum sollte die im Turm herumpfuschen und Kerzen anzünden? Das ist irrsinn.",
      "choices": [
        { "text": "Okay, ich sehe mir das Rad an.", "next": "rad" }
      ]
    },
    {
      "id": "widerspruch_2",
      "speaker": "Gehilfe",
      "avatar": "assets/gehilfe.jpg",
      "text": "Herold stiehlt Kunst, er ritzt keine apokalyptischen Verse ins Holz! Das war ein Wahnsinniger.",
      "choices": [
        { "text": "Bringen Sie mich zum Rad.", "next": "rad" }
      ]
    },
    {
      "id": "success_heiden",
      "speaker": "Gehilfe",
      "avatar": "assets/gehilfe.jpg",
      "text": "Heiden! Genau, der verrückte Prediger. Ich habe ihn gestern um den Turm schleichen sehen. Er murmelte ständig etwas von einer Prophezeiung. Bitte, entschlüsseln Sie das Rad, bevor es Unheil bringt.",
      "isEnd": true,
      "unlockSuspects": true
    },
    {
      "id": "rad",
      "speaker": "Gehilfe",
      "avatar": "assets/gehilfe.jpg",
      "text": "Bitte sehr. Es ist eine komplizierte Chiffrierscheibe. Ich hoffe, Sie kennen sich mit Kryptografie aus.",
      "isEnd": true
    }
  ],
  "hospitalkirche": [
    {
      "id": "start",
      "speaker": "Flussschiffer",
      "avatar": "assets/flussschiffer.jpg",
      "text": "Ahoi, Ermittler. Der Fluss flüstert von dunklen Machenschaften heute Nacht. Ich habe etwas aus dem Wasser gefischt.",
      "choices": [
        { "text": "[Subtil] Der Fluss birgt viele Geheimnisse. Was haben Sie gefunden?", "next": "subtil_1" },
        { "text": "[Direkt] Beweismittel im Mordfall Renger! Übergeben Sie es sofort.", "next": "direkt_1" },
        { "text": "[Skeptisch] Sie kramen im Müll rum? Suchen Sie Pfandflaschen?", "next": "skeptisch_1" }
      ]
    },
    {
      "id": "skeptisch_1",
      "speaker": "Flussschiffer",
      "avatar": "assets/flussschiffer.jpg",
      "text": "Ich fische Leichen und Geheimnisse, nicht Flaschen. Wenn Sie so respektlos sind, werfe ich es wieder rein.",
      "choices": [
        { "text": "Warten Sie. Es tut mir leid. Was ist es?", "next": "direkt_1" },
        { "text": "Tun Sie, was Sie nicht lassen können.", "next": "fail_1" }
      ]
    },
    {
      "id": "fail_1",
      "speaker": "Flussschiffer",
      "avatar": "assets/flussschiffer.jpg",
      "text": "Wie Sie wünschen. *Pflatsch*",
      "isEnd": true
    },
    {
      "id": "subtil_1",
      "speaker": "Flussschiffer",
      "avatar": "assets/flussschiffer.jpg",
      "text": "Eine zerrissene Gründungsurkunde der Rosina-Stiftung. Die Tinte ist fast weggespült, aber im UV-Licht kann man noch was erkennen.",
      "choices": [
        { "text": "Rosina-Stiftung? Da hat Helene von Gipser ihre Finger im Spiel!", "next": "success_gipser", "impact": {"suspect": "gipser", "value": 10} },
        { "text": "Hat Herold das weggeworfen?", "next": "widerspruch_1" },
        { "text": "Geben Sie her, ich habe einen Scanner.", "next": "scan" }
      ]
    },
    {
      "id": "direkt_1",
      "speaker": "Flussschiffer",
      "avatar": "assets/flussschiffer.jpg",
      "text": "Immer mit der Ruhe. Es ist ein Dokument. Zerfetzt. Jemand wollte alte Grundbuchauszüge vernichten. Geht um Bauland in der Altstadt.",
      "choices": [
        { "text": "[Beweis] Bauland? Das führt direkt zum Baukonsortium von Helene von Gipser!", "next": "success_gipser", "impact": {"suspect": "gipser", "value": 10} },
        { "text": "Heiden sucht Bauland für eine neue Kirche?", "next": "widerspruch_1" },
        { "text": "Lassen Sie mich das Dokument scannen.", "next": "scan" }
      ]
    },
    {
      "id": "widerspruch_1",
      "speaker": "Flussschiffer",
      "avatar": "assets/flussschiffer.jpg",
      "text": "Herold? Heiden? Keine Ahnung, was Sie faseln. Auf dem Papier geht es um Zement, Stahl und Bestechungsgelder für städtische Baubehörden.",
      "choices": [
        { "text": "Eindeutig Bauunternehmerin Gipser.", "next": "success_gipser", "impact": {"suspect": "gipser", "value": 10} },
        { "text": "Zeigen Sie her.", "next": "scan" }
      ]
    },
    {
      "id": "success_gipser",
      "speaker": "Flussschiffer",
      "avatar": "assets/flussschiffer.jpg",
      "text": "Gipser... ja, ihr Name steht hier irgendwo verschmiert. Sie wollte die historische Akte vernichten, um billig an das Land zu kommen. Untersuchen Sie das Papier genau.",
      "isEnd": true,
      "unlockSuspects": true
    },
    {
      "id": "scan",
      "speaker": "Flussschiffer",
      "avatar": "assets/flussschiffer.jpg",
      "text": "Nehmen Sie es. Aber vorsichtig, das Papier zerfällt. Sie brauchen UV-Licht, um die verblassten Namen zu lesen.",
      "isEnd": true
    }
  ]
};
