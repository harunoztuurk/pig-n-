const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Kibrit Denklemi - ${i}`,
        questionText: `1 kibrit çöpünün yerini değiştirerek eşitliği sağlayın.`,
        hint: 'V rakamını X yapmayı düşünün.',
        level: i
    });
}