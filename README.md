


# CPU Memory Access Animation

This React + Vite project displays an animation illustrating the movement of dots representing memory accesses between different levels (L1, L2, L3, RAM) and the register of a CPU. The speed of the dots is proportional to the real access time of each memory level and can be adjusted via a slider.

## Features

- Visualization of memory levels (L1, L2, L3, RAM, register)
- Animated dots moving back and forth between each level and the register
- Slider to adjust the speed scale (real time to extreme slowdown)
- Modern and responsive interface

## Getting Started

```bash
npm install
npm run dev
```

## Main Files

- `src/MemoryAnimation.jsx`: Main animation component
- `src/MemoryAnimation.css`: Animation styles
- `src/App.jsx`: Integration of the component in the app

## Customization

You can modify the latencies or the number of dots in `MemoryAnimation.jsx`.

## License

MIT
