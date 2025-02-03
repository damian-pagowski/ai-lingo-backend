const db = require("../db"); // Ensure this is the correct path to your database connection

const easy = [
  {
    question: "Ich __________ in einem Büro.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "arbeite",
    difficulty: 0.2,
    topic: "work",
  },
  {
    question: "Welches Verkehrsmittel benutzt du für die Arbeit?",
    type: "multiple_choice",
    options: JSON.stringify(["Auto", "Fahrrad", "Bus", "Zug"]),
    correct_answer: "Auto",
    difficulty: 0.3,
    topic: "work",
  },
  {
    question: "Der Flug nach Berlin ist um __________ Uhr.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "15",
    difficulty: 0.2,
    topic: "travel",
  },
  {
    question: "Welches Land ist kein Nachbar von Deutschland?",
    type: "multiple_choice",
    options: JSON.stringify(["Frankreich", "Polen", "Spanien", "Dänemark"]),
    correct_answer: "Spanien",
    difficulty: 0.4,
    topic: "travel",
  },
  {
    question: "Im Hotel brauchen wir eine __________.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Reservierung",
    difficulty: 0.3,
    topic: "travel",
  },
  {
    question: "Welche Sprache spricht man in Deutschland?",
    type: "multiple_choice",
    options: JSON.stringify(["Englisch", "Spanisch", "Deutsch", "Französisch"]),
    correct_answer: "Deutsch",
    difficulty: 0.1,
    topic: "general",
  },
  {
    question: "Zum Frühstück esse ich __________.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Brötchen",
    difficulty: 0.2,
    topic: "general",
  },
  {
    question: "Welches Wort bedeutet „Danke“ auf Deutsch?",
    type: "multiple_choice",
    options: JSON.stringify(["Bitte", "Hallo", "Danke", "Tschüss"]),
    correct_answer: "Danke",
    difficulty: 0.1,
    topic: "general",
  },
  {
    question: "Ich möchte eine Fahrkarte nach __________ kaufen.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "München",
    difficulty: 0.3,
    topic: "travel",
  },
  {
    question: "Welches dieser Wörter beschreibt eine Arbeitsstelle?",
    type: "multiple_choice",
    options: JSON.stringify(["Schule", "Büro", "Kino", "Hotel"]),
    correct_answer: "Büro",
    difficulty: 0.3,
    topic: "work",
  },
  {
    question: "Ich fahre jeden Morgen mit dem __________ zur Arbeit.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Bus",
    difficulty: 0.2,
    topic: "work",
  },
  {
    question: "Was brauchst du, um ein Flugticket zu kaufen?",
    type: "multiple_choice",
    options: JSON.stringify(["Reisepass", "Schlüssel", "Handtuch", "Buch"]),
    correct_answer: "Reisepass",
    difficulty: 0.3,
    topic: "travel",
  },
  {
    question: "Mein Chef ist sehr __________.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "freundlich",
    difficulty: 0.4,
    topic: "work",
  },
  {
    question:
      "Welches Dokument brauchst du für die Einreise in ein anderes Land?",
    type: "multiple_choice",
    options: JSON.stringify(["Fahrkarte", "Reisepass", "Geldschein", "Visitenkarte"]),
    correct_answer: "Reisepass",
    difficulty: 0.3,
    topic: "travel",
  },
  {
    question: "Am Wochenende mache ich gerne einen __________ im Park.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Spaziergang",
    difficulty: 0.2,
    topic: "general",
  },
  {
    question: "Wo gehst du hin, wenn du Lebensmittel kaufen möchtest?",
    type: "multiple_choice",
    options: JSON.stringify(["Supermarkt", "Apotheke", "Bibliothek", "Tankstelle"]),
    correct_answer: "Supermarkt",
    difficulty: 0.1,
    topic: "general",
  },
  {
    question: "Ich arbeite als __________ in einem Krankenhaus.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Arzt",
    difficulty: 0.3,
    topic: "work",
  },
  {
    question: "Welche dieser Städte liegt nicht in Deutschland?",
    type: "multiple_choice",
    options: JSON.stringify(["Berlin", "Hamburg", "Wien", "Köln"]),
    correct_answer: "Wien",
    difficulty: 0.4,
    topic: "travel",
  },
  {
    question: "Der Bus fährt um __________ Uhr ab.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "8",
    difficulty: 0.2,
    topic: "travel",
  },
  {
    question: "Welche Farbe hat die deutsche Fahne?",
    type: "multiple_choice",
    options: JSON.stringify(["Rot-Weiß-Blau", "Schwarz-Rot-Gold", "Grün-Gelb", "Blau-Weiß"]),
    correct_answer: "Schwarz-Rot-Gold",
    difficulty: 0.1,
    topic: "general",
  },
  {
    question: "Ich __________ meine Kollegen im Büro.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "treffe",
    difficulty: 0.2,
    topic: "work",
  },
  {
    question: "Welches dieser Wörter bedeutet 'Flughafen'?",
    type: "multiple_choice",
    options: JSON.stringify(["Bahnhof", "Flughafen", "Tankstelle", "Supermarkt"]),
    correct_answer: "Flughafen",
    difficulty: 0.2,
    topic: "travel",
  },
  {
    question: "Ich buche ein __________ für meine Geschäftsreise.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Hotelzimmer",
    difficulty: 0.3,
    topic: "work",
  },
  {
    question: "Was brauchst du, um in einem Hotel einzuchecken?",
    type: "multiple_choice",
    options: JSON.stringify(["Schlüssel", "Pass", "Buch", "Tasche"]),
    correct_answer: "Pass",
    difficulty: 0.3,
    topic: "travel",
  },
  {
    question: "In Deutschland gibt man oft __________ als Begrüßung.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "die Hand",
    difficulty: 0.2,
    topic: "general",
  },
  {
    question: "Welches dieser Lebensmittel gehört nicht zum Frühstück?",
    type: "multiple_choice",
    options: JSON.stringify(["Brötchen", "Kaffee", "Bleistift", "Marmelade"]),
    correct_answer: "Bleistift",
    difficulty: 0.1,
    topic: "general",
  },
  {
    question: "Mein Arbeitsplatz ist im __________ Stock.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "dritten",
    difficulty: 0.3,
    topic: "work",
  },
  {
    question: "Welches Land grenzt nicht an Deutschland?",
    type: "multiple_choice",
    options: JSON.stringify(["Österreich", "Schweiz", "Italien", "Frankreich"]),
    correct_answer: "Italien",
    difficulty: 0.4,
    topic: "travel",
  },
  {
    question: "Ich packe meine __________ für die Reise.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Koffer",
    difficulty: 0.2,
    topic: "travel",
  },
  {
    question: "Welche dieser Städte ist die Hauptstadt von Deutschland?",
    type: "multiple_choice",
    options: JSON.stringify(["München", "Hamburg", "Berlin", "Frankfurt"]),
    correct_answer: "Berlin",
    difficulty: 0.1,
    topic: "general",
  },
  {
    question: "Ich __________ jeden Morgen um 8 Uhr zur Arbeit.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "fahre",
    difficulty: 0.2,
    topic: "work",
  },
  {
    question: "Welches Verkehrsmittel benutzt man für eine Geschäftsreise?",
    type: "multiple_choice",
    options: JSON.stringify(["Fahrrad", "Auto", "Flugzeug", "Bus"]),
    correct_answer: "Flugzeug",
    difficulty: 0.3,
    topic: "work",
  },
  {
    question: "Ich brauche eine __________, um ins Ausland zu reisen.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Reisepass",
    difficulty: 0.2,
    topic: "travel",
  },
  {
    question: "Welches dieser Wörter bedeutet 'Gepäck'?",
    type: "multiple_choice",
    options: JSON.stringify(["Tasche", "Koffer", "Rucksack", "Handschuh"]),
    correct_answer: "Koffer",
    difficulty: 0.2,
    topic: "travel",
  },
  {
    question: "Am Wochenende gehe ich oft ins __________.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Kino",
    difficulty: 0.2,
    topic: "general",
  },
  {
    question: "Welches dieser Lebensmittel isst man oft zum Mittagessen?",
    type: "multiple_choice",
    options: JSON.stringify(["Brötchen", "Suppe", "Kaffee", "Tee"]),
    correct_answer: "Suppe",
    difficulty: 0.1,
    topic: "general",
  },
  {
    question: "Meine Arbeit beginnt um __________ Uhr morgens.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "neun",
    difficulty: 0.3,
    topic: "work",
  },
  {
    question: "Welches dieser Länder spricht Deutsch als offizielle Sprache?",
    type: "multiple_choice",
    options: JSON.stringify(["Spanien", "Schweiz", "Italien", "Frankreich"]),
    correct_answer: "Schweiz",
    difficulty: 0.4,
    topic: "general",
  },
  {
    question: "Ich nehme den __________ zum Flughafen.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Zug",
    difficulty: 0.2,
    topic: "travel",
  },
  {
    question: "Welcher dieser Orte ist kein Arbeitsplatz?",
    type: "multiple_choice",
    options: JSON.stringify(["Büro", "Supermarkt", "Schule", "Strand"]),
    correct_answer: "Strand",
    difficulty: 0.2,
    topic: "work",
  },
  {
    question: "Ich arbeite in einem __________.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Büro",
    difficulty: 0.2,
    topic: "work",
  },
  {
    question: "Welches dieser Dinge findet man in einem Büro?",
    type: "multiple_choice",
    options: JSON.stringify(["Tafel", "Schreibtisch", "Bett", "Herd"]),
    correct_answer: "Schreibtisch",
    difficulty: 0.2,
    topic: "work",
  },
  {
    question: "Wir fahren im Sommer in den __________.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Urlaub",
    difficulty: 0.2,
    topic: "travel",
  },
  {
    question: "Welches dieser Wörter bedeutet 'Flugticket'?",
    type: "multiple_choice",
    options: JSON.stringify(["Bordkarte", "Fahrkarte", "Reisepass", "Gepäck"]),
    correct_answer: "Bordkarte",
    difficulty: 0.3,
    topic: "travel",
  },
  {
    question: "Ich bestelle eine __________ im Restaurant.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Pizza",
    difficulty: 0.1,
    topic: "general",
  },
  {
    question: "Welches dieser Getränke ist heiß?",
    type: "multiple_choice",
    options: JSON.stringify(["Wasser", "Kaffee", "Limonade", "Cola"]),
    correct_answer: "Kaffee",
    difficulty: 0.1,
    topic: "general",
  },
  {
    question: "Ich __________ jeden Morgen um 7 Uhr auf.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "stehe",
    difficulty: 0.3,
    topic: "general",
  },
  {
    question: "Welches dieser Wörter beschreibt einen Verkehrsmittel?",
    type: "multiple_choice",
    options: JSON.stringify(["Flughafen", "Taxi", "Hotel", "Restaurant"]),
    correct_answer: "Taxi",
    difficulty: 0.2,
    topic: "travel",
  },
  {
    question: "Ich brauche eine __________, um in der Stadt Bus zu fahren.",
    type: "fill_in_the_blank",
    options: null,
    correct_answer: "Fahrkarte",
    difficulty: 0.2,
    topic: "travel",
  },
  {
    question: "Welches dieser Dinge gehört nicht zu einem Büro?",
    type: "multiple_choice",
    options: JSON.stringify(["Computer", "Telefon", "Waschmaschine", "Drucker"]),
    correct_answer: "Waschmaschine",
    difficulty: 0.3,
    topic: "work",
  },
];

const medium = [
  {
    question: "Welche Fähigkeit ist in einem Büro am wichtigsten?",
    type: "multiple_choice",
    options: JSON.stringify(["Tippen", "Klettern", "Schwimmen", "Tanzen"]),
    correct_answer: "Tippen",
    difficulty: 0.5,
    topic: "work"
  },
  {
    question: "Was ist eine gängige Arbeitszeit in Deutschland?",
    type: "multiple_choice",
    options: JSON.stringify(["6:00 - 12:00", "8:00 - 17:00", "14:00 - 22:00", "20:00 - 5:00"]),
    correct_answer: "8:00 - 17:00",
    difficulty: 0.6,
    topic: "work"
  },
  {
    question: "Welcher dieser Begriffe beschreibt eine Teamarbeit?",
    type: "multiple_choice",
    options:JSON.stringify(["Meeting", "Urlaub", "Pause", "Alleinarbeit"]),
    correct_answer: "Meeting",
    difficulty: 0.4,
    topic: "work"
  },
  {
    question: "Was musst du am Flughafen vor dem Abflug tun?",
    type: "multiple_choice",
    options:JSON.stringify(["Einchecken", "Einkaufen", "Koffer öffnen", "Taxi nehmen"]),
    correct_answer: "Einchecken",
    difficulty: 0.5,
    topic: "traveling"
  },
  {
    question: "Welches Dokument brauchst du für eine internationale Reise?",
    type: "multiple_choice",
    options:JSON.stringify(["Führerschein", "Personalausweis", "Reisepass", "Bibliotheksausweis"]),
    correct_answer: "Reisepass",
    difficulty: 0.7,
    topic: "traveling"
  },
  {
    question: "Welches Verkehrsmittel ist am schnellsten für lange Strecken?",
    type: "multiple_choice",
    options:JSON.stringify(["Zug", "Auto", "Fahrrad", "Flugzeug"]),
    correct_answer: "Flugzeug",
    difficulty: 0.6,
    topic: "traveling"
  },
  {
    question: "Wie begrüßt man einen Freund in Deutschland?",
    type: "multiple_choice",
    options:JSON.stringify(["Händeschütteln", "Umarmen", "Küsschen auf die Wange", "Winken"]),
    correct_answer: "Händeschütteln",
    difficulty: 0.5,
    topic: "social_interactions"
  },
  {
    question: "Welche Frage ist eine übliche Vorstellung?",
    type: "multiple_choice",
    options:JSON.stringify(["Wie alt bist du?", "Was kostet das?", "Was machst du beruflich?", "Wie ist das Wetter?"]),
    correct_answer: "Was machst du beruflich?",
    difficulty: 0.6,
    topic: "social_interactions"
  },
  {
    question: "Wie verabschiedet man sich höflich in Deutschland?",
    type: "multiple_choice",
    options:JSON.stringify(["Ciao", "Auf Wiedersehen", "Servus", "Guten Tag"]),
    correct_answer: "Auf Wiedersehen",
    difficulty: 0.4,
    topic: "social_interactions"
  },
  {
    question: "Was kauft man üblicherweise im Supermarkt?",
    type: "multiple_choice",
    options:JSON.stringify(["Kleidung", "Lebensmittel", "Möbel", "Elektronik"]),
    correct_answer: "Lebensmittel",
    difficulty: 0.5,
    topic: "daily_life"
  },
  {
    question: "Welcher dieser Orte gehört nicht zu einem Einkaufszentrum?",
    type: "multiple_choice",
    options:JSON.stringify(["Bäckerei", "Bank", "Friseursalon", "Tankstelle"]),
    correct_answer: "Tankstelle",
    difficulty: 0.6,
    topic: "daily_life"
  },
  {
    question: "Wann gehen die meisten Menschen in Deutschland einkaufen?",
    type: "multiple_choice",
    options:JSON.stringify(["Sonntags", "Abends nach 22 Uhr", "Unter der Woche bis 20 Uhr", "An Feiertagen"]),
    correct_answer: "Unter der Woche bis 20 Uhr",
    difficulty: 0.7,
    topic: "daily_life"
  }
];

const medium2 = [
  {
    question: "Welche Kleidung ist am besten für ein Vorstellungsgespräch?",
    type: "multiple_choice",
    options: JSON.stringify(["Anzug", "Badehose", "Jogginghose", "Schlafanzug"]),
    correct_answer: "Anzug",
    difficulty: 0.5,
    topic: "work"
  },
  {
    question: "Welche dieser Tätigkeiten gehört zu einem Bürojob?",
    type: "multiple_choice",
    options: JSON.stringify(["Telefonieren", "Schweißen", "Kochen", "Malen"]),
    correct_answer: "Telefonieren",
    difficulty: 0.6,
    topic: "work"
  },
  {
    question: "Welcher dieser Begriffe beschreibt eine Beförderung?",
    type: "multiple_choice",
    options: JSON.stringify(["Gehaltserhöhung", "Urlaub", "Kündigung", "Teilzeit"]),
    correct_answer: "Gehaltserhöhung",
    difficulty: 0.7,
    topic: "work"
  },
  {
    question: "Was sollte man am Flughafen zuerst tun?",
    type: "multiple_choice",
    options: JSON.stringify(["Einchecken", "Gepäck verlieren", "Pass wegwerfen", "Koffer öffnen"]),
    correct_answer: "Einchecken",
    difficulty: 0.5,
    topic: "traveling"
  },
  {
    question: "Welches Verkehrsmittel ist umweltfreundlicher?",
    type: "multiple_choice",
    options: JSON.stringify(["Zug", "Auto", "Flugzeug", "Motorrad"]),
    correct_answer: "Zug",
    difficulty: 0.6,
    topic: "traveling"
  },
  {
    question: "Was braucht man, um ein Hotelzimmer zu buchen?",
    type: "multiple_choice",
    options: JSON.stringify(["Kreditkarte", "Führerschein", "Tageskarte", "Studentenausweis"]),
    correct_answer: "Kreditkarte",
    difficulty: 0.7,
    topic: "traveling"
  },
  {
    question: "Wie begrüßt man eine neue Person höflich?",
    type: "multiple_choice",
    options: JSON.stringify(["Guten Tag", "Tschüss", "Mahlzeit", "Danke"]),
    correct_answer: "Guten Tag",
    difficulty: 0.5,
    topic: "social_interactions"
  },
  {
    question: "Welche dieser Antworten ist eine höfliche Entschuldigung?",
    type: "multiple_choice",
    options: JSON.stringify(["Es tut mir leid", "Mir egal", "Mach doch selbst", "Egal"]),
    correct_answer: "Es tut mir leid",
    difficulty: 0.6,
    topic: "social_interactions"
  },
  {
    question: "Welche Geste wird in Deutschland als unhöflich angesehen?",
    type: "multiple_choice",
    options: JSON.stringify(["Mittelfinger zeigen", "Lächeln", "Hand geben", "Nicken"]),
    correct_answer: "Mittelfinger zeigen",
    difficulty: 0.7,
    topic: "social_interactions"
  },
  {
    question: "Wo kauft man in Deutschland typischerweise frisches Brot?",
    type: "multiple_choice",
    options: JSON.stringify(["Bäckerei", "Tankstelle", "Postamt", "Bibliothek"]),
    correct_answer: "Bäckerei",
    difficulty: 0.5,
    topic: "daily_life"
  }
];

const seedExercises = async () => {
  try {
    await db("exercises").insert(medium2);
    console.log("✅ Exercises seeded successfully.");
  } catch (error) {
    console.error("❌ Error inserting exercises:", error);
  } finally {
    process.exit();
  }
};

seedExercises();
