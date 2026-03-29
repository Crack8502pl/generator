// Dane dla generatorów przeniesione z backendu
const SKP_DATA = [
            { nazwa: "Kamera Panasonic WV-U1532LA", zaleznosc: "brak", zmienna: "Tak", klasa: "Lanz", typ: "Kamera-0" },
            { nazwa: "AdapternasłupowyDahuaDH-PFA152-E", zaleznosc: "Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Puszka WV-QJB500-G", zaleznosc: "Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Przepięciówka PTF-51 ENG/PoE EWIMAR/micro", zaleznosc: "Lanz", zmienna: "NIE", klasa: "klasa-0", typ: "zabezpieczenie" },
            { nazwa: "Przepięciówka 4 kanałowego zabezpieczenia PTF-54 Pro PoE EWIMAR", zaleznosc: "Lanz", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Panel ochronny RACK- LAN/HD-CCTV/lP CCTV PTU/PTF-5-Rack EWIMAR", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Zasilacz Meanwell NDR-240-48", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Przewód teleinformatyczny F/UTP U/UTP kat.5e 305m", zaleznosc: "5m x Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Keyston cat.5e", zaleznosc: "2x Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Przetwornica UPS SlNUSPRO-800E", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Akumulator 12V 65Ah", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Przekaźnik", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Wtyk RJ-45 UTP kat.5e drut/linka -100 sztuk", zaleznosc: "4x Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Moduł PET-7060 CR 6-channel Power Relay Output", zaleznosc: "1", zmienna: "NIE", klasa: "lan", typ: "Moduł dozorowy" },
            { nazwa: "patchcord lan 0,5m", zaleznosc: "Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "iglicodaszek/kapturek", zaleznosc: "Słup", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "patchcord lan 2m", zaleznosc: "Moduł dozorowy", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "słup + fundament", zaleznosc: "brak", zmienna: "Tak", klasa: "klasa-0", typ: "Słup" },
            { nazwa: "patchcord lan 0,25m", zaleznosc: "4x Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Szafa terenowa kompletna", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Switch", zaleznosc: "1", zmienna: "NIE", klasa: "LAN0", typ: "Switch" }
        ];

        // PRZYKŁADOWE DANE DO KAT A (możesz rozszerzyć)
const KATa_DATA = [
            { nazwa: "Kamera Panasonic WV-U1532LA", zaleznosc: "brak", zmienna: "Tak", klasa: "Lanz", typ: "Kamera-0" },
            { nazwa: "AdapternasłupowyDahuaDH-PFA152-E", zaleznosc: "Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Puszka WV-QJB500-G", zaleznosc: "Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Przepięciówka PTF-51 ENG/PoE EWIMAR/micro", zaleznosc: "Lanz", zmienna: "NIE", klasa: "klasa-0", typ: "zabezpieczenie" },
            { nazwa: "Przepięciówka 4 kanałowego zabezpieczenia PTF-54 Pro PoE EWIMAR", zaleznosc: "Lanz", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Panel ochronny RACK- LAN/HD-CCTV/lP CCTV PTU/PTF-5-Rack EWIMAR", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Zasilacz Meanwell NDR-240-48", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Przewód teleinformatyczny F/UTP U/UTP kat.5e 305m", zaleznosc: "5m x Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Keyston cat.5e", zaleznosc: "2x Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Przetwornica UPS SlNUSPRO-800E", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Akumulator 12V 65Ah", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Przekaźnik", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Wtyk RJ-45 UTP kat.5e drut/linka -100 sztuk", zaleznosc: "4x Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Moduł PET-7060 CR 6-channel Power Relay Output", zaleznosc: "1", zmienna: "NIE", klasa: "lan", typ: "Moduł dozorowy" },
            { nazwa: "patchcord lan 0,5m", zaleznosc: "Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "iglicodaszek/kapturek", zaleznosc: "Słup", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "patchcord lan 2m", zaleznosc: "Moduł dozorowy", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "słup + fundament", zaleznosc: "brak", zmienna: "Tak", klasa: "klasa-0", typ: "Słup" },
            { nazwa: "patchcord lan 0,25m", zaleznosc: "4x Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Szafa terenowa kompletna", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Switch", zaleznosc: "1", zmienna: "NIE", klasa: "LAN0", typ: "Switch" },
			{ nazwa: "Kamera i-PRO WV-S1536LTN", zaleznosc: "brak", zmienna: "Tak", klasa: "Lanz", typ: "Kamera-1" },
			{ nazwa: "SLICAN Kolumna głośnikowa AUD.IP-AMP10.LD1040", zaleznosc: "brak", zmienna: "Tak", klasa: "Lanz1", typ: "Audio" },
			{ nazwa: "SAR kompletny", zaleznosc: "brak", zmienna: "Tak", klasa: "Lanz1", typ: "Audio" },
			{ nazwa: "Kabel I/O Panasonic WV-QCA501A", zaleznosc: "1", zmienna: "brak", klasa: "klasa-0", typ: "akcesoria" },
			{ nazwa: "Mikrofon Metel BREAK-TWA-MIC-ECT-M 3-100-724", zaleznosc: "1", zmienna: "brak", klasa: "klasa-0", typ: "akcesoria" },
			{ nazwa: "Słupek pod SAR", zaleznosc: "1", zmienna: "Tak", klasa: "klasa-0", typ: "akcesoria" }
		];
		// Dodaj po linii 81 (po KATa_DATA):
const KATB_DATA = [
            { nazwa: "Kamera Panasonic WV-U1532LA", zaleznosc: "brak", zmienna: "Tak", klasa: "Lanz", typ: "Kamera-0" },
            { nazwa: "AdapternasłupowyDahuaDH-PFA152-E", zaleznosc: "Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Puszka WV-QJB500-G", zaleznosc: "Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Przepięciówka PTF-51 ENG/PoE EWIMAR/micro", zaleznosc: "Lanz", zmienna: "NIE", klasa: "klasa-0", typ: "zabezpieczenie" },
            { nazwa: "Przepięciówka 4 kanałowego zabezpieczenia PTF-54 Pro PoE EWIMAR", zaleznosc: "Lanz", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Panel ochronny RACK- LAN/HD-CCTV/lP CCTV PTU/PTF-5-Rack EWIMAR", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Zasilacz Meanwell NDR-240-48", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Przewód teleinformatyczny F/UTP U/UTP kat.5e 305m", zaleznosc: "5m x Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Keyston cat.5e", zaleznosc: "2x Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Przetwornica UPS SlNUSPRO-800E", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Akumulator 12V 65Ah", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Przekaźnik", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Wtyk RJ-45 UTP kat.5e drut/linka -100 sztuk", zaleznosc: "4x Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Moduł PET-7060 CR 6-channel Power Relay Output", zaleznosc: "1", zmienna: "NIE", klasa: "lan", typ: "Moduł dozorowy" },
            { nazwa: "patchcord lan 0,5m", zaleznosc: "Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "iglicodaszek/kapturek", zaleznosc: "Słup", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "patchcord lan 2m", zaleznosc: "Moduł dozorowy", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "słup + fundament", zaleznosc: "brak", zmienna: "Tak", klasa: "klasa-0", typ: "Słup" },
            { nazwa: "patchcord lan 0,25m", zaleznosc: "4x Kamera-0", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Szafa terenowa kompletna", zaleznosc: "1", zmienna: "NIE", klasa: "klasa-0", typ: "akcesoria" },
            { nazwa: "Switch", zaleznosc: "1", zmienna: "NIE", klasa: "LAN0", typ: "Switch" },
			{ nazwa: "Kamera i-PRO WV-S1536LTN", zaleznosc: "brak", zmienna: "Tak", klasa: "Lanz", typ: "Kamera-1" },
			{ nazwa: "Kabel I/O Panasonic WV-QCA501A", zaleznosc: "1", zmienna: "brak", klasa: "klasa-0", typ: "akcesoria" },
			{ nazwa: "Mikrofon Metel BREAK-TWA-MIC-ECT-M 3-100-724", zaleznosc: "1", zmienna: "brak", klasa: "klasa-0", typ: "akcesoria" },
			{ nazwa: "Rejestrator", zaleznosc: "1", zmienna: "brak", klasa: "lan", typ: "Rejestrator" },
			{ nazwa: "Monitor 22 DHI-LM22-L200", zaleznosc: "1", zmienna: "brak", klasa: "klasa-0", typ: "akcesoria" }
		];

const NASTAWNIA_DATA = [
    { nazwa: "Akcesoria instalacyjne wewnątrz budynkowe", zaleznosc: "1", zmienna: "NIE", klasa: "brak", typ: "akcesoria" }
		];