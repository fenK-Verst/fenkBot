let exceltojson = require("xlsx-to-json-lc");
exceltojson({
    input: "rasp.xlsx",
    output: "123.json",
    lowerCaseHeaders: true //to convert all excel headers to lowr case in json
}, async (err, result) => {
    if (err) {
        console.error(err);
    } else {
        // console.log(result);
        let n = [];
        result.forEach((value, index) => {
            let date = value.date,
                l1 = value["1"] || null,
                l12 = value["11"] || null,
                l2 = value["2"] || null,
                l21 = value["21"] || null,
                l3 = value["3"] || null,
                l4 = value["4"] || null,
                l5 = value["5"] || null,
                l6 = value["6"] || null;

            l12 = l12 ? " : " + l12 : '';
            l21 = l21 ? " : " + l21 : '';

            l1 = l1 ? l1 + l12 : null;
            l2 = l2 ? l2 + l21 : null;

            n.push({
                l1: l1,
                l2: l2,
                l3: l3,
                l4: l4,
                l5: l5,
                l6: l6,
                date: date
            });
        });
        // db.run("DELETE FROM lessons");
        n.forEach((value, index) => {
            // console.log(index);
            let l1 = value.l1,
                l2 = value.l2,
                l3 = value.l3,
                l4 = value.l4,
                l5 = value.l5,
                l6 = value.l6,
                date = value.date;
            if (date) {
                date = date.split("/");
                date = new Date((+date[2]), date[1] - 1, date[0]);

                date.setHours(0, 0, 0, 0);

                date = date.getSqlite();

                console.log(date);

                // db.run(`INSERT INTO lessons(date,l1,l2,l3,l4,l5,l6)VALUES (?,?,?,?,?,?,?)`, [date, l1, l2, l3, l4, l5, l6], function (err) {
                //     if (err) {
                //         return console.log(err.message);
                //     }
                //     console.log(`A row has been inserted with rowid ${this.lastID}`);
                // });
            }
        });
        // await context.send("done");

    }
});
Date.prototype.getSqlite = function () {
    let month = this.getMonth();
    if (month.toString().length == 1) month = "0"+String(month);
    return `${this.getFullYear()}-${month}-${this.getDate()}`;
};