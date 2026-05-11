const levelsData = [
    {
        id: 1,
        title: "Temel Aktarım",
        questionText: "Bölge A'daki tüm Kırmızı (Ateş) ve Mavi (Su) bloklarını, fare ile sürükleyerek B Bölgesine taşıyın.",
        hint: "Bu alıştırma seviyesidir. Sadece tüm blokları sağ taraftaki boşluklara bırakın.",
        items: [
            { id: 'item1', type: 'type-1', icon: '🔥' },
            { id: 'item2', type: 'type-1', icon: '🔥' },
            { id: 'item3', type: 'type-2', icon: '💧' },
            { id: 'item4', type: 'type-2', icon: '💧' }
        ],
        // Doğrulama Kuralları: Hepsi Zone B'de olmalı
        verify: (zoneBItems, zoneAItems) => {
            if (zoneAItems.length > 0) return { success: false, message: "A Bölgesinde bırakılan öğeler var." };
            if (zoneBItems.length === 4) return { success: true };
            return { success: false, message: "Tüm bloklar hedefe ulaşmadı." };
        }
    },
    {
        id: 2,
        title: "Ayrıştırma Paradoksu",
        questionText: "Kırmızı (Ateş) ve Mavi (Su) blokları yer değiştirmelisin. Mavi blokları Zone B'ye, Kırmızı blokları A'da bırak (veya geri getir).",
        hint: "Mavileri karşıya, Kırmızıları başlangıçta bırak.",
        items: [
            { id: 'item1', type: 'type-1', icon: '🔥' },
            { id: 'item2', type: 'type-1', icon: '🔥' },
            { id: 'item3', type: 'type-2', icon: '💧' },
            { id: 'item4', type: 'type-2', icon: '💧' },
            { id: 'item5', type: 'type-2', icon: '💧' }
        ],
        verify: (zoneBItems, zoneAItems) => {
            const bTypes = zoneBItems.map(i => i.type);
            const aTypes = zoneAItems.map(i => i.type);

            if (bTypes.includes('type-1')) return { success: false, message: "Ateş blokları B bölgesine geçemez, hata!" };
            if (aTypes.includes('type-2')) return { success: false, message: "Su bloklarının hepsi B bölgesine gitmeli." };
            
            return { success: true };
        }
    },
    {
        id: 3,
        title: "Üçlü Denge",
        questionText: "Kırmızı(Ateş), Mavi(Su) ve Sarı(Yıldırım) bloklar var. Bölge B'ye SADECE her renkten tam olarak 1 adet koyun. Diğerleri A'da kalsın.",
        hint: "Zone B'de toplam 3 öğe olmalı ve hepsi farklı renkte olmalı.",
        items: [
            { id: 'item1', type: 'type-1', icon: '🔥' },
            { id: 'item2', type: 'type-1', icon: '🔥' },
            { id: 'item3', type: 'type-2', icon: '💧' },
            { id: 'item4', type: 'type-2', icon: '💧' },
            { id: 'item5', type: 'type-3', icon: '⚡' },
            { id: 'item6', type: 'type-3', icon: '⚡' }
        ],
        verify: (zoneBItems, zoneAItems) => {
            if (zoneBItems.length !== 3) return { success: false, message: "B Bölgesinde tam 3 öge bulunmalıdır!" };
            
            const types = zoneBItems.map(i => i.type);
            const isUnique = new Set(types).size === types.length; // duplicate kontrolü
            
            if (!isUnique) return { success: false, message: "B Bölgesindeki blokların her biri farklı türde olmalıdır." };
            
            return { success: true };
        }
    }
];
