import Chance from "./Chance.mjs";

export default class AdvancedChance extends Chance {
    static max(rolls, sides, arr=[]) {
        var highest = 0;
        for (var i = 0; i < rolls; ++i) {
            const roll = Chance.die(sides);
            if (roll > highest) highest = roll;
            arr.push(roll);
        }
        return highest;
    }

    static min(rolls, sides, arr=[]) {
        var lowest = Infinity;
        for (var i = 0; i < rolls; ++i) {
            const roll = Chance.die(sides);
            if (roll < lowest) lowest = roll;
            arr.push(roll);
        }
        return lowest;
    }

    static each(rolls, sides, fn, arr=[])
    {
        var sum = 0;
        for (var i = 0; i < rolls; ++i) {
            const roll = Chance.die(sides);
            sum += fn(i, roll);
            arr.push(roll);
        }
        return sum;
    }

    static xdx(rolls, sides, arr=[]) {
        var sum = 0;
        for (var i = 0; i < rolls; ++i) {
            const roll = Chance.die(sides);
            sum += roll;
            arr.push(roll);
        }
        return sum;
    }

    static xdx_if(rolls, sides, op, value, arr=[]) {
        var sum = 0;
        for (var i = 0; i < rolls; ++i) {
            const roll = Chance.die(sides);
            switch (op) {
                case "==":
                    if (roll == value) {
                        sum += roll;
                    }
                break;
                case "!=":
                    if (roll != value) {
                        sum += roll;
                    }
                break;
                case "<":
                    if (roll < value) {
                        sum += roll;
                    }
                break;
                case ">":
                    if (roll > value) {
                        sum += roll;
                    }
                    break;
                case "<=":
                    if (roll <= value) {
                        sum += roll;
                    }
                break;
                case ">=":
                    if (roll >= value) {
                        sum += roll;
                    }
                break;      
            }
           
            arr.push(roll);
        }
        return sum;
    }

    static xdx_custom(rolls, sides, arr=[]) {
        var sum = 0;
        for (let i = 0; i < rolls; ++i) {
            const roll = Chance.pickFromArray(sides);
            sum += roll;
            arr.push(roll);
        }
        return sum;
    }

    static shuffle(arr) {
        var currentIndex = arr.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Chance.generator() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [arr[currentIndex], arr[randomIndex]] = [
            arr[randomIndex], arr[currentIndex]];
        }
      
        return arr;
    }

    static prime(min, max) {
        const getPrimes = (min, max) => {
            const result = Array(max + 1)
              .fill(0)
              .map((_, i) => i);
            for (let i = 2; i <= Math.sqrt(max + 1); i++) {
              for (let j = i ** 2; j < max + 1; j += i) delete result[j];
            }
            return Object.values(result.slice(Math.max(min, 2)));
          };
        
        const primes = getPrimes(min, max);
        return Chance.choose(primes);
    }

    static uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Chance.generator() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    static seedRand(str) {
        for(var i = 0, h = 2166136261 >>> 0; i < str.length; i++) {
          h = Math.imul(h ^ str.charCodeAt(i), 16777619);
        }
        h += h << 13; h ^= h >>> 7;
        h += h << 3;  h ^= h >>> 17;
        let seed = (h += h << 5) >>> 0;
    
        let rand = () => (2 ** 31 - 1 & (seed = Math.imul(48271, seed))) / 2 ** 31;
        rand();
        return rand;
    }

    static drop(rolls, die, d, op='r', arr = [])
    {
        var   rarr = undefined;
        const r = AdvancedChance.xdx(rolls, die, arr);
        rarr = structuredClone(arr);
        switch (op) {
            case "l": case "low": 
                rarr.sort().splice(0, d);
                return rarr;
            case "h": case "high": 
                rarr.sort().splice(rarr.length - d, d);
                return rarr;
            default:
                while (d > 0) {
                    rarr.splice(Chance.int(0, rarr.length-1), 1);
                    --d;
                }
                return rarr;
        }
    }

    static keep(rolls, die, keep, op='r', arr = [])
    {
        var   rarr = undefined;
        const r = AdvancedChance.xdx(rolls, die, arr);
        rarr = structuredClone(arr);
        switch (op) {
            case "l": case "low": return rarr.sort().splice(0, keep);
            case "h": case "high": 
                return rarr.sort().splice(rarr.length - keep, keep);
            default: // random
                const k = [];
                while (keep > 0) {
                    var s = rarr.splice(Chance.int(0, rarr.length-1), 1);
                    k.push(s[0]);
                    --keep;
                }
                return k;
        }
    }

    static explode(rolls, sides, arr=[]) {
        let result = 0;

        for (let i = 0; i < rolls; ++i) {
            let roll = AdvancedChance.die(sides);
            if (roll == sides) {
                --i;
            }
            result += roll;
            arr.push(roll);
        }

        return result;
    }

    static diminishing(rolls, sides, arr=[]) {
        let result = 0;

        for (let i = 0; i < rolls; ++i) {
            let roll = AdvancedChance.die(sides);
            if (roll == sides) {
                --i; sides -= 2;
                if (sides < 2) sides = 2;
            }
            result += roll;
            arr.push(roll);
        }

        return result;
    }

    static pentrate(rolls, sides, arr=[]) {
        let result = 0;

        for (let i = 0; i < rolls; ++i) {
            let roll = AdvancedChance.die(sides);
            const value =  roll - i;
            if (value > 0) {
                result += value;
            }
            arr.push(roll);
        }

        return result;
    }

    static reroll(rolls, sides, op, value, arr=[]) {
        let result = 0;

        for (let i = 0; i < rolls; ++i) {
            let roll = AdvancedChance.die(sides);
            switch (op) {
                case "==":
                    if (roll == value) {
                        --i;
                    }
                    result += roll;
                break;
                case "!=":
                    if (roll != value) {
                        --i;
                    }
                    result += roll;
                break;
                case "<":
                    if (roll < value) {
                        --i;
                    }
                    result += roll;
                break;
                case ">":
                    if (roll > value) {
                        --i;
                    }
                    result += roll;
                    break;
                case "<=":
                    if (roll <= value) {
                        --i;
                    }
                    result += roll;
                break;
                case ">=":
                    if (roll >= value) {
                        --i;
                    }
                    result += roll;
                break;      
            }
            
            arr.push(roll);
        }

        return result;
    }

    static match(rolls, sides, arr=[]) {
        let result = 0;
        for (let i = 0; i < rolls; ++i) {
            const value = AdvancedChance.die(sides);
            arr.push(value);
        }
        for (let i = 1; i < arr.length; i += 2) {
            const a = arr[i-1];
            const b = arr[i];
            if (a == b) {
                result += a;
            }
        }
        return result;
    }
}