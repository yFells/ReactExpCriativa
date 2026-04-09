import realImg from '../imgs/real-camisa.webp';
import palmeirasImg from '../imgs/palmeiras-camisa.webp';
import flamengoImg from '../imgs/flamengo-camisa.webp';
import selecaoImg from '../imgs/selecao-camisa.webp';
import cityImg from '../imgs/city-camisa.webp';
import barcelonaImg from '../imgs/barcelona-camisa.webp';
import liverpoolImg from '../imgs/liverpool-camisa.webp';
import corintiasImg from '../imgs/corintias-camisa.webp';
import surpresaImg from '../imgs/surpresa-camisa.webp';

const teamImageMap = [
  { keys: ['real madrid', 'real'], img: realImg },
  { keys: ['palmeiras'], img: palmeirasImg },
  { keys: ['flamengo'], img: flamengoImg },
  { keys: ['seleção', 'selecao', 'seleção brasileira', 'brasil'], img: selecaoImg },
  { keys: ['manchester city', 'man city', 'city'], img: cityImg },
  { keys: ['barcelona', 'barça', 'barca'], img: barcelonaImg },
  { keys: ['liverpool'], img: liverpoolImg },
  { keys: ['corinthians', 'corinthian', 'corintias', 'corintianos'], img: corintiasImg },
];

export function getShirtImage(clubName) {
  if (!clubName) return null;
  const normalized = clubName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  for (const entry of teamImageMap) {
    if (entry.keys.some(key => normalized.includes(key))) {
      return entry.img;
    }
  }
  return surpresaImg;
}
