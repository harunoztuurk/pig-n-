const levelsData = [
    {
        id: 1,
        title: "Kitap Ayracı",
        questionText: "Bir kız okuduğu romana kitap ayracı koydu. Önce ayracı 339 ve 340. sayfalar arasına koyduğunu düşündü. Ardından 388 ve 389. sayfalar arasına koyduğunu düşündü. Elbette her iki seferde de haklı olamazdı, ancak her iki seferde de haksız değildi.<br><br>Hangi tahmininde haklıydı?",
        type: "choice",
        options: ["İlkinde (339-340)", "İkincisinde (388-389)"],
        answer: "İkincisinde (388-389)",
        hint: "Sayfa 339 ve 340 aynı yaprağın arkalı önlü yüzleri midir?"
    },
    {
        id: 2,
        title: "Kediler ve Fareler",
        questionText: "Dört kedinin dört fareyi yakalaması 4 dakika sürüyorsa, 48 kedinin 48 fareyi yakalaması kaç dakika sürer?",
        type: "number",
        answer: "4",
        hint: "Kediler işi ortaklaşa mı yapıyor yoksa her biri kendi faresini mi kovalıyor?"
    },
    {
        id: 3,
        title: "Banka Faizi",
        questionText: "Eğer Giant (Dev) Bankasına 20$ yatırırsanız 2 yıl sonra 2$ faiz alırsınız. Titan Bankasına 30$ yatırırsanız 3 yıl sonra 3$ faiz alırsınız. Hangi banka daha iyi bir anlaşma sunuyor?",
        type: "choice",
        options: ["Giant Bank", "Titan Bank", "İkisi de aynı"],
        answer: "Giant Bank",
        hint: "Yıllık yüzde (oran) olarak hesaplayın. Giant Bank %10 kazancı 2 yılda, Titan Bank 3 yılda verir."
    },
    {
        id: 4,
        title: "Çikolata Kırma",
        questionText: "4x6 (24 parça) büyüklüğünde dikdörtgen bir çikolata kalıbı var. Her hamlede var olan bir parçayı boydan veya enden ikiye kesebiliyoruz. 24 adet ayrı tekli çikolata parçası elde etmek için minimum kaç kırma işlemi (hamle) yapılmalıdır?",
        type: "number",
        answer: "23",
        hint: "Her kırma işlemi bağımsız parça sayısını tam olarak 1 artırır."
    },
    {
        id: 5,
        title: "Yalancılar Kulübü",
        questionText: "Alice, Brian, Colin, Debra, Edwin ve Fiona şu ifadeleri kullanıyor:<br>Alice: Sadece 1'imiz yalan söylüyor.<br>Brian: Tam 2'miz yalan söylüyor.<br>Colin: Tam 3'ümüz yalan söylüyor.<br>Debra: Tam 4'ümüz yalan söylüyor.<br>Edwin: Tam 5'imiz yalan söylüyor.<br>Fiona: Hepimiz yalan söylüyoruz.<br><br>Sizce içlerinden MANSİYONA LAYIK gerçek doğrucu (kim doğru söylüyor) kimdir?",
        type: "text",
        answer: "edwin",
        hint: "Hepsinin ifadesi çelişiyor. Yani aralarından sadece biri doğru söylüyor olabilir. Bu durumda kaçı yalan söylüyor olur?"
    },
    {
        id: 6,
        title: "Flört Eşleşmeleri",
        questionText: "Alice, Debra ve Fiona; Brian, Colin ve Edwin ile eşleşeceklerdir (sırasıyla olmak zorunda değil).<br><br>Alice, Brian ile eşleşmez. Debra, Colin ile eşleşmez. Colin de Alice ile eşleşmez. Fiona kiminle eşleşmiştir?",
        type: "text",
        answer: "colin",
        hint: "Colin Alice ile eşleşmediğine ve Debra da Colin ile eşleşmediğine göre... Geriye Fiona-Colin kalıyor!"
    },
    {
        id: 7,
        title: "Yuvarlak Masa",
        questionText: "Alice, Brian, Colin, Debra, Edwin ve Fiona yuvarlak bir masada sıralı (1'den 6'ya) oturuyorlar.<br>• Alice 1. sandalyede oturuyor olsun.<br>• Fiona, Alice'in solundaki (saat yönünde) ikinci sandalyede.<br>• Debra, Fiona'nın solundaki ikinci sandalyede.<br>• Brian, Debra'ya bitişiktir.<br>• Colin ve Brian, Fiona'ya bitişik iki koltuktadır.<br><br>Lütfen sandalyeye (1'den 6'ya sırayla) oturanların isimlerini Virgül koyarak boşluksuz yazın. (Örn: alice,brian,colin,debra,edwin,fiona)",
        type: "text",
        answer: "alice,colin,fiona,brian,debra,edwin",
        hint: "Eğer Alice 1, Fiona 3, Debra 5 ise; Fiona(3)'e bitişik 2 veya 4 kalır. Brian Debra(5)'e de bitişikse 4'tür. Bu durumda yerleri çizin."
    },
    {
        id: 8,
        title: "Komşuluk",
        questionText: "Alice, Brian, Colin, Debra ve Edwin yan yana beş ayrı evde yaşıyor.<br>• Edwin; Brian veya Colin'e komşu değil.<br>• Debra; Colin veya Edwin'e komşu değil.<br>• Alice; Brian veya Colin'e komşu değil.<br><br>Tam ortadaki evde kim oturuyor?",
        type: "text",
        answer: "debra",
        hint: "Edwin komşulukları redediyor, demek ki uçlardan birinde. Onun komşusu Alice olmalı."
    },
    {
        id: 9,
        title: "Depo Görevlileri",
        questionText: "Depoda 5 işçi var (Sadece 5 kişi!). İsimleri/Soyisimleri tabloda:<br>• Salı: Başkan Mr. Northcott, işçi Dick<br>• Çrş: Başkan Mr. Eastwood, işçiler Bill ve Fred<br>• Perş: Başkan Mr. Upton, işçiler Harry ve Dick<br><br>Salı günü kurallarına baktığımızda Dick'in soyadı Northcott olamaz. Peki soyadı WESTWOOD olan kişinin ilk adı nedir?",
        type: "text",
        answer: "dick",
        hint: "Dick Salı günü Northcott'un altında, Perş Upton'ın altında, Çrş ve Cuma diğer başkanlar varken çalışıyor. Demek ki o başkan olduğu gün Pazartesidir (Westwood)!"
    },
    {
        id: 10,
        title: "Paradoks Soru",
        questionText: "Bu problemi çözmeden önce çözdüğünüz problemden sonra çözdüğünüz problemden önce çözdüğünüz problem, bu problemi çözmeden önce çözdüğünüz problemden sonra çözdüğünüz problemden daha zorsa; bu problemi çözmeden önce çözdüğünüz problem, bu problemden daha mı zordur?",
        type: "choice",
        options: ["Evet", "Hayır"],
        answer: "Evet",
        hint: "Metni sadeleştirin. 'Bu problemi çözmeden önce...' diyerek A problemine referans veriyor. Sonra dolaylı yoldan B problemini dahil ediyor."
    }
];
