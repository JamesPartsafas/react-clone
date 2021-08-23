import { useState } from './MyReact.js'

export default function Component({ propCount }) {

    const [count, setCount] = useState(0)

    const propCountDoubled = 0

    return `
        State: ${count}
        Prop: ${propCount}
        Prop Doubled: ${propCountDoubled}
    `
}