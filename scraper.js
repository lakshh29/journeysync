const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const URL = "https://www.redbus.in";  // Replace with the actual website URL

async function scrapeBusData() {
    try {
        // Fetch the HTML content of the page
        const { data } = await axios.get(URL, { headers: { "User-Agent": "Mozilla/5.0" } });

        // Load HTML into Cheerio
        const $ = cheerio.load(data);
        let buses = [];

        // Loop through each bus row (Modify the class names based on the actual website)
        $(".bus-row").each((index, element) => {
            const bus_id = $(element).find(".bus-id").text().trim();
            const route = $(element).find(".route").text().trim();
            const source = $(element).find(".source").text().trim();
            const destination = $(element).find(".destination").text().trim();
            const departure_time = $(element).find(".departure").text().trim();
            const arrival_time = $(element).find(".arrival").text().trim();

            buses.push({ bus_id, route, source, destination, departure_time, arrival_time });
        });

        // Save data as JSON inside the `journeysync` folder
        fs.writeFileSync("bus_data.json", JSON.stringify(buses, null, 2));
        console.log("Scraping complete. Data saved to bus_data.json");
    } catch (error) {
        console.error("Error scraping data:", error);
    }
}

// Run the scraper
scrapeBusData();
