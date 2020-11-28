
export default async function getAllLinks (page, selector) {
    const linkArr = await page.$$eval(
        selector,
        links => links.map(link => link.getAttribute("href"))
    );

    const uniqueLinks = new Set(linkArr);
    uniqueLinks.delete('#');

    return uniqueLinks;
}
