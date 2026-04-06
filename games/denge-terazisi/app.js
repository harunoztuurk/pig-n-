const gameId = 'denge-terazisi';

let draggedItem = null;
let leftTotal = 0;
let rightTotal = 0;

// Levels with target side (left) and available pieces (right pool)
const levels = [
    {
        "task": "Sol kefedeki 2.5 birimini dengele",
        "targetVal": 2.5,
        "targetDisplay": "2.5",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 3.5 birimini dengele",
        "targetVal": 3.5,
        "targetDisplay": "3.5",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 4.5 birimini dengele",
        "targetVal": 4.5,
        "targetDisplay": "4.5",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            }
        ]
    },
    {
        "task": "Sol kefedeki 1.5 birimini dengele",
        "targetVal": 1.5,
        "targetDisplay": "1.5",
        "pool": [
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            }
        ]
    },
    {
        "task": "Sol kefedeki 3.5 birimini dengele",
        "targetVal": 3.5,
        "targetDisplay": "3.5",
        "pool": [
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 5 birimini dengele",
        "targetVal": 5,
        "targetDisplay": "5",
        "pool": [
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 3.5 birimini dengele",
        "targetVal": 3.5,
        "targetDisplay": "3.5",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 3 birimini dengele",
        "targetVal": 3,
        "targetDisplay": "3",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 2 birimini dengele",
        "targetVal": 2,
        "targetDisplay": "2",
        "pool": [
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 2.5 birimini dengele",
        "targetVal": 2.5,
        "targetDisplay": "2.5",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 1.5 birimi dengele",
        "targetVal": 1.5,
        "targetDisplay": "1.5",
        "pool": [
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 1.5 birimi dengele",
        "targetVal": 1.5,
        "targetDisplay": "1.5",
        "pool": [
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefede çeyrek (1/4) bulunuyor, dengele",
        "targetVal": 0.25,
        "targetDisplay": "1/4",
        "pool": [
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 0.75 birimi dengele",
        "targetVal": 0.75,
        "targetDisplay": "0.75",
        "pool": [
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            }
        ]
    },
    {
        "task": "Sol kefedeki 1.25 birimi dengele",
        "targetVal": 1.25,
        "targetDisplay": "1.25",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            }
        ]
    },
    {
        "task": "Sol kefede 3/4 bulunuyor, dengeyi sağla",
        "targetVal": 0.75,
        "targetDisplay": "3/4",
        "pool": [
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            }
        ]
    },
    {
        "task": "Sol kefedeki 1.25 birimi dengele",
        "targetVal": 1.25,
        "targetDisplay": "1.25",
        "pool": [
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefede 3/4 bulunuyor, dengeyi sağla",
        "targetVal": 0.75,
        "targetDisplay": "3/4",
        "pool": [
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            }
        ]
    },
    {
        "task": "Sol kefedeki 1.5 birimi dengele",
        "targetVal": 1.5,
        "targetDisplay": "1.5",
        "pool": [
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            }
        ]
    },
    {
        "task": "Sol kefedeki 1.5 birimi dengele",
        "targetVal": 1.5,
        "targetDisplay": "1.5",
        "pool": [
            {
                "display": "1/2",
                "val": 0.5,
                "type": "fraction"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Altın Oran yaklaşımı ~1.61'i oluştur",
        "targetVal": 1.61,
        "targetDisplay": "Altın Oran ≈ 1.61",
        "pool": [
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Altın Oran yaklaşımı ~1.61'i oluştur",
        "targetVal": 1.61,
        "targetDisplay": "Altın Oran ≈ 1.61",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            }
        ]
    },
    {
        "task": "Pi'nin yaklaşımı olan ~3.14'ü oluştur",
        "targetVal": 3.14,
        "targetDisplay": "π ≈ 3.14",
        "pool": [
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Pi'nin yaklaşımı olan ~3.14'ü oluştur",
        "targetVal": 3.14,
        "targetDisplay": "π ≈ 3.14",
        "pool": [
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Pi'nin yaklaşımı olan ~3.14'ü oluştur",
        "targetVal": 3.14,
        "targetDisplay": "π ≈ 3.14",
        "pool": [
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "2.5 toplamını bul!",
        "targetVal": 2.5,
        "targetDisplay": "2.5",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Euler sayısı olan ~2.71'i oluştur",
        "targetVal": 2.71,
        "targetDisplay": "e ≈ 2.71",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Pi'nin yaklaşımı olan ~3.14'ü oluştur",
        "targetVal": 3.14,
        "targetDisplay": "π ≈ 3.14",
        "pool": [
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Euler sayısı olan ~2.71'i oluştur",
        "targetVal": 2.71,
        "targetDisplay": "e ≈ 2.71",
        "pool": [
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            }
        ]
    },
    {
        "task": "2.5 toplamını bul!",
        "targetVal": 2.5,
        "targetDisplay": "2.5",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/4",
                "val": 0.25,
                "type": "fraction"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 2.375 birimi dengele",
        "targetVal": 2.375,
        "targetDisplay": "2.375",
        "pool": [
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Kök 2 yaklaşık değeri: 1.41'i oluştur",
        "targetVal": 1.41,
        "targetDisplay": "√2 ≈ 1.41",
        "pool": [
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 2.375 birimi dengele",
        "targetVal": 2.375,
        "targetDisplay": "2.375",
        "pool": [
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Kök 2 yaklaşık değeri: 1.41'i oluştur",
        "targetVal": 1.41,
        "targetDisplay": "√2 ≈ 1.41",
        "pool": [
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefede 3/8 bulunuyor, dengeyi sağla",
        "targetVal": 0.375,
        "targetDisplay": "3/8",
        "pool": [
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 4.2 birimi dengele",
        "targetVal": 4.2,
        "targetDisplay": "4.2",
        "pool": [
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 4.2 birimi dengele",
        "targetVal": 4.2,
        "targetDisplay": "4.2",
        "pool": [
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 1.125 birimi dengele",
        "targetVal": 1.125,
        "targetDisplay": "1.125",
        "pool": [
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Kök 2 yaklaşık değeri: 1.41'i oluştur",
        "targetVal": 1.41,
        "targetDisplay": "√2 ≈ 1.41",
        "pool": [
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefede 5/8 var",
        "targetVal": 0.625,
        "targetDisplay": "5/8",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Kök 2 yaklaşık değeri: 1.41'i oluştur",
        "targetVal": 1.41,
        "targetDisplay": "√2 ≈ 1.41",
        "pool": [
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefede 7/8 bulunuyor, dengele",
        "targetVal": 0.875,
        "targetDisplay": "7/8",
        "pool": [
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefede 7/8 bulunuyor, dengele",
        "targetVal": 0.875,
        "targetDisplay": "7/8",
        "pool": [
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefede 5/8 var",
        "targetVal": 0.625,
        "targetDisplay": "5/8",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 4.2 birimi dengele",
        "targetVal": 4.2,
        "targetDisplay": "4.2",
        "pool": [
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefede 5/8 var",
        "targetVal": 0.625,
        "targetDisplay": "5/8",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Kök 3 yaklaşık değeri: 1.73'ü oluştur",
        "targetVal": 1.73,
        "targetDisplay": "√3 ≈ 1.73",
        "pool": [
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Sol kefedeki 4.2 birimi dengele",
        "targetVal": 4.2,
        "targetDisplay": "4.2",
        "pool": [
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Kök 3 yaklaşık değeri: 1.73'ü oluştur",
        "targetVal": 1.73,
        "targetDisplay": "√3 ≈ 1.73",
        "pool": [
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "0.01",
                "val": 0.01,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1/8",
                "val": 0.125,
                "type": "fraction"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            }
        ]
    },
    {
        "task": "Kök 3 yaklaşık değeri: 1.73'ü oluştur",
        "targetVal": 1.73,
        "targetDisplay": "√3 ≈ 1.73",
        "pool": [
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            },
            {
                "display": "1",
                "val": 1,
                "type": "decimal"
            },
            {
                "display": "0.125",
                "val": 0.125,
                "type": "decimal"
            },
            {
                "display": "0.25",
                "val": 0.25,
                "type": "decimal"
            },
            {
                "display": "0.5",
                "val": 0.5,
                "type": "decimal"
            },
            {
                "display": "0.1",
                "val": 0.1,
                "type": "decimal"
            }
        ]
    }
];


let currentLevelIndex = 0;

function initGame() {
    loadLevel(currentLevelIndex);
}

function loadLevel(index) {
    if (index >= levels.length) {
        index = Math.floor(Math.random() * levels.length);
    }
    
    const level = levels[index];
    document.getElementById('gameTask').textContent = level.task;
    document.getElementById('gameMessage').textContent = '';
    
    leftTotal = level.targetVal;
    rightTotal = 0;
    
    // Sol kefeyi oluştur
    const leftTray = document.getElementById('leftTray');
    leftTray.innerHTML = `<div class="weight-item" style="cursor:default; background:var(--pink);">${level.targetDisplay}</div>`;
    
    // Sağ kefeyi temizle
    document.getElementById('rightTray').innerHTML = '';
    
    // Ağırlık havuzunu diz
    const pool = document.getElementById('weightPool');
    pool.innerHTML = '';
    
    level.pool.forEach(w => {
        const div = document.createElement('div');
        div.className = `weight-item drag-item ${w.type}`;
        div.draggable = true;
        div.dataset.val = w.val;
        div.textContent = w.display;
        pool.appendChild(div);
    });

    updateScale();
    setupDragAndDrop();
}

function updateScale() {
    // Toplam ağırlıkları kefelerden oku (sağ kefe interaktif)
    const rightTray = document.getElementById('rightTray');
    rightTotal = 0;
    
    Array.from(rightTray.children).forEach(child => {
        rightTotal += parseFloat(child.dataset.val);
    });

    const diff = leftTotal - rightTotal;
    
    // Maksimum rotasyon açısı
    const maxAngle = 20;
    let angle = diff * 15; // Çarpan
    
    // Sınırlandırma
    if (angle > maxAngle) angle = maxAngle;
    if (angle < -maxAngle) angle = -maxAngle;
    
    const beam = document.getElementById('scaleBeam');
    
    // Açı: pozitifse sol ağır bastı (saat yönünün tersi = -deg mantıken, ama CSS'te rotate+ saat yönüdür)
    // Left heavy -> left side drops -> rotate counter-clockwise (-)
    // Diff > 0 means left is heavier.
    
    beam.style.transform = `rotate(${-angle}deg)`;
    
    // Kefelerin dik durması için ters açı
    const pans = document.querySelectorAll('.scale-pan');
    pans.forEach(pan => {
        // Sepetin yere dik durması için beam'in açısının tersini alır
        pan.style.transform = `rotate(${angle}deg)`;
    });
}

function setupDragAndDrop() {
    const items = document.querySelectorAll('.drag-item');
    const rightTray = document.getElementById('rightTray');
    const pool = document.getElementById('weightPool');

    items.forEach(item => {
        item.addEventListener('dragstart', () => {
            draggedItem = item;
            setTimeout(() => item.classList.add('dragging'), 0);
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            draggedItem = null;
            updateScale();
        });
    });

    [rightTray, pool].forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            if(zone.id === 'rightTray') zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            if(draggedItem) {
                zone.appendChild(draggedItem);
                updateScale();
            }
        });
    });
}

window.checkGame = function() {
    // updateScale() zaten değerleri hesaplar ancak son bir kontrol yapalım
    updateScale();
    const msg = document.getElementById('gameMessage');
    
    // Float sayıların toplanmasındaki küsurat hataları için yuvarlayarak karşılaştırma
    if (Math.abs(leftTotal - rightTotal) < 0.001) {
        msg.textContent = 'MÜKEMMEL DENGE! SİSTEM DOĞRULANDI.';
        msg.className = 'game-message success';
        
        if (typeof GameUtils !== 'undefined') {
            let currentScore = GameUtils.getScore(gameId);
            GameUtils.saveScore(gameId, currentScore + 100);
        }

        setTimeout(() => {
            currentLevelIndex++;
            loadLevel(currentLevelIndex);
        }, 2000);
    } else {
        msg.textContent = 'Terazi henüz dengede değil!';
        msg.className = 'game-message error';
    }
};

window.onload = initGame;
