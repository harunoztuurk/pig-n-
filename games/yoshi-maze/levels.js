const levelsData = [];
for (let i = 1; i <= 50; i++) {
    const types = ['normal', 'arrow', 'ice'];
    const type = types[i % 3];
    const size = 5 + Math.floor(i / 10);
    
    // Create a simple dummy grid
    let grid = [];
    for(let r = 0; r < size; r++){
        let row = [];
        for(let c = 0; c < size; c++){
            if(r===0 && c===0) row.push('S');
            else if(r===size-1 && c===size-1) row.push('G');
            else row.push((Math.random() < 0.2) ? 'W' : '0');
        }
        grid.push(row);
    }
    
    levelsData.push({
        id: i,
        title: `Labirent - Kat ${i}`,
        questionText: type === 'ice' ? 'Buzlu zeminde kayın.' : 'Hedefe ulaşın.',
        hint: 'Duvarlara dikkat edin.',
        columns: size,
        rows: size,
        type: type,
        grid: grid
    });
}