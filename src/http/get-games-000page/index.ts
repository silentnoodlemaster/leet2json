import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.15-alpha/deno-dom-wasm.ts';
import { HTMLElement } from 'https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts'

class Leet {
  root: string;
  base: string;
  items: Record<string, string|null>[] = [];
  pages = 0;

  constructor(public name: string) {
    this.root = "https://1337x.to/";
    this.base = `${this.root}${name}-torrents/`;
  }
  async build(page = 1) {
    console.log(`${this.base}${page}/`);
    const res = await fetch(`${this.base}${page}/`);
    const html = await res.text();
    const document = new DOMParser().parseFromString(html, 'text/html');
    if (document) {
      this.pages = parseInt(document.querySelector('li.last a')!.getAttribute('href')!.split('/')[2]);
      document.querySelectorAll('td.coll-1.name').forEach((e: HTMLElement) => {
        e.querySelectorAll('a:not(.icon)').forEach((a: HTMLElement) => {
          const href = a.getAttribute('href');
          const name = a.textContent;
          this.items.push({
            name: name,
            url: href
          });
        });
      });
    }
    const body = {items: this.items, pages: this.pages} as any;
    if (page+1 < this.pages )
      body.nextPage = page+1;
    if (page-1 > 1)
      body.prevPage = page -1;
    
    return body;
  }
}

export async function handler (req: any) {
  const leet = new Leet('johncena141');
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json; charset=utf8',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    body: JSON.stringify(await leet.build(req.pathParameters.page))
  }
}
