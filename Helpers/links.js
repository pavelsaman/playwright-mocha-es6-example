
export default async function getAllLinks (page, selector) {
    const links = await page.$$eval(selector,
        links => links.map(link => link.getAttribute("href"))
    );

    const uniqueLinks = new Set(links);
    uniqueLinks.delete('#');
    
    return uniqueLinks;
}