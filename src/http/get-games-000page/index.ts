import Leet from '../../scrapers/list.ts';

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
