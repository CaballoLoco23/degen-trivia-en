/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

const app = new Frog<{
  State: {
    coleccion: { nombre: string; descripcion: string, imagen: string, valor: string }[],
    opciones: { nombre: string; descripcion: string, imagen: string, valor: string }[],
    actual: { nombre: string; descripcion: string, imagen: string, valor: string },
    aciertos: { nombre: string; descripcion: string, imagen: string, valor: string }[],
    ganaste: boolean,
    acierto: boolean | null,
    aciertosNecesarios: number
  }
}>({
    initialState: {
      coleccion: [
        { nombre: "Degen", descripcion: 'Which channel was the DEGEN token launched on?', imagen: '', valor: 'deg' },
        { nombre: "Arbitrum Orbit", descripcion: 'Under what technology was the DEGEN blockchain created?', imagen: '', valor: 'arb' },
        { nombre: "DegenSwap", descripcion: 'What is the main DEX of the DEGEN chain?', imagen: '', valor: 'dgw' },
        { nombre: "Drakula", descripcion: 'Which application did DEGEN adopt, thus increasing its utility?', imagen: '', valor: 'dra' },
        { nombre: "Tips", descripcion: 'The use of DEGEN in Warpcast is for what purpose?', imagen: '', valor: 'ray' },
        { nombre: "Relay", descripcion: 'Bridge that allows transferring DEGEN from the Layer 2 of BASE to the Layer 3 of DEGEN', imagen: '', valor: 'rel' },
      ],
      opciones: [],
      actual: {},
      aciertos: [],
      ganaste: false,
      acierto: null,
      aciertosNecesarios: 3
    },
    assetsPath: '/',
    basePath: '/api',
  })

app.frame('/', (c) => {

  const { buttonValue, deriveState, status } = c
  const { acierto, ganaste, actual, opciones } = deriveState((state) => {
   
    let opt: any[];
    opt = [];
    let correctos = state.aciertos;
    state.acierto = null;
    state.ganaste = false;
   
    if ((!state.aciertosNecesarios && state.coleccion.length - state.aciertos.length <= 3) || (state.aciertosNecesarios > 0 && state.aciertos.length >= state.aciertosNecesarios)) {
      state.ganaste = true;
      state.acierto = false;
      state.aciertos = [];
      state.opciones = [];
    } else {
      if (state.actual.valor && buttonValue && buttonValue === state.actual.valor) {
        state.acierto = true;
        state.aciertos.push(state.actual);
      } else if (state.actual.valor && buttonValue && buttonValue !== state.actual.valor) {
        state.acierto = false;
      }
      while (opt.length < 3) {
        let rand = Math.floor(Math.random() * state.coleccion.length);
        let f = correctos.findIndex(x => x.valor === state.coleccion[rand].valor);
        if (!opt.includes(state.coleccion[rand]) && f < 0) {
          opt.push(state.coleccion[rand]);
        }
      }
      let dado = Math.floor(Math.random() * 2);
      state.actual = opt[dado];
      state.opciones = opt;
    }
  });
  if (status === 'initial') {
    return c.res({
      image: (
        <div tw="flex flex-col w-full h-full p-10 bg-purple-500 justify-center items-center">
          <div tw="text-white text-6xl">
          How much do you know about DEGEN?
          </div>
          <div tw="text-white text-4xl mt-10">
          (Choose the correct option)
          </div>
        </div>
      ),
      intents: [
        <Button value="init">Test yourself !</Button>,
      ],
    })
  }
  if (ganaste) {
    return c.res({
      image: (
        <div tw="flex flex-col w-full h-full p-10 bg-purple-500 justify-center items-center">
          <div tw="mt-6 text-white text-7xl">CONGRATULATIONS!</div>
          <div tw="text-white text-4xl mt-8">🌟 DEGEN Fan 🌟</div>
          <div tw="flex flex-none mt-10"><img src={'/degen.png'} style={{ width: '30%' }} /></div>
        </div>
      ),
      intents: [
        <Button>Play again</Button>,
        <Button.Reset>Restart</Button.Reset>
      ],
    })
  }
  if (acierto === false) {
    return c.res({
      image: (
        <div tw="flex flex-col w-full h-full p-10 bg-white justify-center items-center">
          <div tw="text-black text-6xl">I'm sorry, please try again 👎🏻🤦</div>
        </div>
      ),
      intents: [
        <Button>Try again</Button>,
        
      ],
    })
  }
  if (acierto === true) {
    return c.res({
      image: (
        <div tw="flex flex-col w-full h-full p-10 bg-white justify-center items-center">
          <div tw="text-black text-6xl">Very good !!! 💜🎩</div>
        </div>
      ),
      intents: [
        <Button value="">Keep playing</Button>
      ],
    })
  }
  return c.res({
    image: (
      <div tw="flex flex-col justify-center items-center h-screen bg-black">
        <div tw="text-white text-5xl text-center p-10">{actual.descripcion}</div>
      </div>

    ),
    intents: [
      <Button value={opciones[0].valor}>{opciones[0].nombre}</Button>,
      <Button value={opciones[1].valor}>{opciones[1].nombre}</Button>,
      <Button value={opciones[2].valor}>{opciones[2].nombre}</Button>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
