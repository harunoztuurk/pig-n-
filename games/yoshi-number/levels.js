const levelsData = [
    {
        id: 1,
        title: "Döngüler (Çemberler)",
        questionText: "Aşağıdaki sayılar ve onların karşılıkları bir mantığa dayanmaktadır:<br><br>88 ➔ 4<br>81 ➔ 2<br>11 ➔ 0<br><br>Sizce <span class='highlight'>6666</span> kaça eşittir?",
        type: "number",
        answer: "4",
        hint: "Matematiksel bir işlem değil, sayıların şekillerine odaklanın. 8 rakamında kaç tane 'kapalı yuvarlak' (döngü) var?"
    },
    {
        id: 2,
        title: "Kelimelerin Sayısı",
        questionText: "BİR = 3<br>İKİ = 3<br>ÜÇ = 2<br>DÖRT = 4<br><br>Sizce <span class='highlight'>ON İKİ (Bitişik Düşünün)</span> kaça eşittir?",
        type: "number",
        answer: "5",
        hint: "ON İKİ kelimesini oluşturan harflerin sayısını düşünün."
    },
    {
        id: 3,
        title: "Şaşırtmacalı Eşitlik",
        questionText: "Eğer:<br>1 = 5<br>2 = 25<br>3 = 125<br>4 = 625 ise;<br><br><span class='highlight'>5 = ?</span> Kaçtır?",
        type: "number",
        answer: "1",
        hint: "İşlem yapmaya çalışmayın, ilk satıra geri dönüp tekrar okuyun. Eşitlik iki taraflıdır!"
    },
    {
        id: 4,
        title: "Fiyat Hesabı",
        questionText: "Bir masa tenisi raketi ve topun toplam fiyatı 110 TL'dir. Raket, toptan 100 TL daha pahalıdır.<br><br>Sadece <span class='highlight'>topun fiyatı kaç TL'dir?</span>",
        type: "number",
        answer: "5",
        hint: "Top 10 TL derseniz, raket 110 TL olur ve toplamları 120 TL yapar. Denklem kurun: T + (T + 100) = 110"
    },
    {
        id: 5,
        title: "Bak ve Söyle",
        questionText: "Diziyi inceleyin:<br><br>1<br>11<br>21<br>1211<br>111221<br><br>Sonraki sayı <span class='highlight'>ne olmalıdır?</span>",
        type: "number",
        answer: "312211",
        hint: "Her satır, bir önceki satırın 'okunuşunu' verir. Mesela '11' -> iki tane 1 (21) demektir."
    },
    {
        id: 6,
        title: "Gizli Şifre",
        questionText: "Ben üç basamaklı bir sayıyım.<br>• Onlar basamağım, birler basamağımdan 5 fazladır.<br>• Yüzler basamağım ise onlar basamağımdan 8 eksiktir.<br><br>Sizce <span class='highlight'>ben hangi sayıyım?</span>",
        type: "number",
        answer: "194",
        hint: "Yüzler basamağının sıfır olamayacağını ve rakamların 9'u geçemeyeceğini düşünerek denemeler yapın."
    },
    {
        id: 7,
        title: "9'ların Sayısı",
        questionText: "1'den 100'e kadar (1 ve 100 dahil) yazarken <span class='highlight'>toplam kaç tane 9 rakamı</span> kullanırsınız?",
        type: "number",
        answer: "20",
        hint: "Birler basamağında 9 olanları (9, 19, ..., 99) sayın. Sonra Onlar basamağında 9 olanları (90, 91, ..., 99) sayın. 99 sayısında iki adet 9 kullanıldığını unutmayın!"
    },
    {
        id: 8,
        title: "Artan Farklar",
        questionText: "Şu serideki mantığı çözün:<br><br>2, 3, 5, 8, 12, 17, <span class='highlight'>?</span><br><br>Soru işareti yerine hangi sayı gelmelidir?",
        type: "number",
        answer: "23",
        hint: "Sayılar arasındaki farklara bakın. İlk fark 1, ikinci fark 2, üçüncü fark 3... O halde 17'den sonra ne eklemelisiniz?"
    },
    {
        id: 9,
        title: "Zaman Makinesi",
        questionText: "Şu anda diyelim ki saat tam <span class='highlight'>15:00</span> (öğleden sonra üç).<br><br>Tam 999 saat sonra saat kaç olur? Lütfen sadece saati (0-23 arası bir rakam) yazın.",
        type: "number",
        answer: "6",
        hint: "1000 saat sonra desek, 1000'i 24'e böldüğümüzde kalan 16 olur. 15'e 16 ekleyip 24 çıkarın. Veya 999 üzerinden gidin."
    },
    {
        id: 10,
        title: "Tersyüz Yıllar",
        questionText: "1881 ve 1961 yılları baş aşağı (180 derece ters) çevrildiğinde yine kendileri olarak okunurlar.<br><br>1961'den sonraki, baş aşağı çevrildiğinde <span class='highlight'>yine aynı okunan ilk yıl hangisidir?</span>",
        type: "number",
        answer: "6009",
        hint: "Rakamların simetrisini düşünün; 0, 1, 8 hem düz hem ters aynıdır. Ancak 6 ters çevrilince 9 olur, 9 ters çevrilince 6 olur. 1961'den sonraki yeni bir bin yıla bakmanız gerekebilir."
    }
];
