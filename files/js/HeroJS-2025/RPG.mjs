import AdvancedChance from "./AdvancedChance.mjs";

export default class RPG {
    static rpg_input(str, arr=[]) {
        let result = "";
        for (let i = 0; i < str.length; ++i) {
            let c = str[i];
            if (c == '{') {
                let value = "";
                ++i;
                c = str[i];
                while (i < str.length && c != '}') {
                    value += c;
                    ++i;
                    c = str[i];
                }
                result += RPG.rpg_raw(value, arr);
            } else {
                result += c;
            }
        }

        return result;
    }

    static getParams(str, s='(', e=')')
    {
        let result = "";
        let depth  = 1;

        for (let i = 0; i < str.length; ++i) {
            let c = str[i];

            if (c == s) {
                ++depth;
                result += c;
            }
            else if (c == e) {
                --depth;
                if (depth <= 0)
                    return result;
            } else {
                result += c;
            }
        }

        return result;
    }

    static tokenize_calc(str)
    {
        const results = [];
        const matchs = {
            op:       /^(\+|\-|\*|\/|\%)/,
            vars:     /^([a-zA-Z][a-zA-Z0-9_]*)/,
            number:   /^(-?[0-9]*\.[0-9]+|-?[0-9]+)/,
        };

        while (str.length) {
            let m = undefined;
            for (let name in matchs) {
                let match = matchs[name];
                m         = match.exec(str);
                if (m) {
                    if (name == "number") m[1] = parseFloat(m[1]);
                    results.push(m[1]);
                    str = str.substring(m[0].length);
                }
            }

            if (!m) {
                str = str.substring(1);
            }
        }

        return results;
    }

    static rpg_raw(str, arr=[]) {
        const match = {
            eachOp:     /^([0-9]+e([0-9]+)(<|>|<=|>=|==|!=)([0-9]+)\[)/,
            each:     /^([0-9]+e([0-9]+)\[)/,
            function: /^([a-zA-Z_][a-zA-Z0-9_]*)\(/,
            min:      /^([0-9]+)d([0-9]+)min/,
            max:      /^([0-9]+)d([0-9]+)max/,
            match:    /^([0-9]+)d([0-9]+)match/,
            drop:     /^([0-9]+)d([0-9]+)d(l|h)?([0-9]+)/,
            keep:     /^([0-9]+)d([0-9]+)k(l|h)?([0-9]+)/,
            reroll:   /^([0-9]+)d([0-9]+)r(<|>|<=|>=|==|!=)([0-9]+)/,
            pentrate: /^([0-9]+)d([0-9]+)\!p/,
            explode:  /^([0-9]+)d([0-9]+)\!/,
            diceOp:   /^([0-9]+)d([0-9]+)(<|>|<=|>=|==|!=)([0-9]+)/,
            dice:     /^([0-9]+)d([0-9]+)/,
            fudge:    /^([0-9]+)df/,
            rangef1:   /^(-?[0-9]*\.[0-9]+)\.\.(-?[0-9]+)/,
            rangef2:   /^(-?[0-9]+)\.\.(-?[0-9]*\.[0-9]+)/,
            rangef3:   /^(-?[0-9]*\.[0-9]+)\.\.(-?[0-9]*\.[0-9]+)/,
            range:    /^(-?[0-9]+)\.\.(-?[0-9]+)/,
            op:       /^(<=|>=|==|!=|[\+\-\*\/\%\^\<\>])/,
            number:   /^(-?[0-9]*\.[0-9]+|-?[0-9]+)/,
            lparen:   /^(\()/,
            rparen:   /^(\))/
        };

        const result = [];

        while (str.length) {
            let r = undefined;
            for (let name in match) {
                const m = match[name];
                r = m.exec(str);

                if (r) {
                    switch (name) {
                        case "eachOp":
                        {
                            var p = RPG.getParams(str.substring(r[0].length), '[', ']');
                            var x = RPG.tokenize_calc(p);
                            var sum = 0;
                            var op    = r[3];
                            var value = parseInt(r[4]);
                            for (var i = 0; i < parseInt(r[1]); ++i) {
                                const roll = AdvancedChance.die(parseInt(r[2]));

                                switch (op) {
                                    case "==":
                                        if (roll == value) {
                                            sum += RPG.calc(structuredClone(x), {i, roll});
                                        }
                                    break;
                                    case "!=":
                                        if (roll != value) {
                                            sum += RPG.calc(structuredClone(x), {i, roll});
                                        }
                                    break;
                                    case "<":
                                        if (roll < value) {
                                            sum += RPG.calc(structuredClone(x), {i, roll});
                                        }
                                    break;
                                    case ">":
                                        if (roll > value) {
                                            sum += RPG.calc(structuredClone(x), {i, roll});
                                        }
                                        break;
                                    case "<=":
                                        if (roll <= value) {
                                            sum += RPG.calc(structuredClone(x), {i, roll});
                                        }
                                    break;
                                    case ">=":
                                        if (roll >= value) {
                                            sum += RPG.calc(structuredClone(x), {i, roll});
                                        }
                                    break;      
                                }
                            
                                
                                arr.push(roll);
                            }
                            return sum;
                        }
                        break;
                        case "each":
                        {
                            var p = RPG.getParams(str.substring(r[0].length), '[', ']');
                            var x = RPG.tokenize_calc(p);
                            var sum = 0;
                            for (var i = 0; i < parseInt(r[1]); ++i) {
                                const roll = AdvancedChance.die(parseInt(r[2]));
                                sum += RPG.calc(structuredClone(x), {i, roll});
                                arr.push(roll);
                            }
                            return sum;
                        }
                        break;
                        case "function":
                        {
                            var p = RPG.getParams(str.substring(r[0].length));
                            var x = RPG.rpg_raw(p, arr);

                            switch (r[1].toLowerCase()) {
                                case "sin": x = Math.sin(x); break;
                                case "cos": x = Math.cos(x); break;
                                case "abs": x = Math.abs(x); break;
                                case "floor": x = Math.floor(x); break;
                                case "ceil": x = Math.ceil(x); break;
                                case "round": x = Math.round(x); break;
                                case "sqrt": x = Math.sqrt(x); break;
                                case "sign": x = Math.sign(x); break;
                            }

                            result.push(x);

                            str = str.substring(p.length);
                        }
                        break;
                        case "reroll":
                            var rr = AdvancedChance.reroll(parseInt(r[1]), parseInt(r[2]), r[3], parseInt(r[4]), arr);
                            result.push(rr);
                        break;
                        case "min":
                            var rr = AdvancedChance.min(parseInt(r[1]), parseInt(r[2]), arr);
                            result.push(rr);
                        break;
                        case "max":
                            var rr = AdvancedChance.max(parseInt(r[1]), parseInt(r[2]), arr);
                            result.push(rr);
                        break;
                        case "match":
                            var rr = AdvancedChance.match(parseInt(r[1]), parseInt(r[2]), arr);
                            result.push(rr);
                        break;
                        case "pentrate":
                            var rr = AdvancedChance.pentrate(parseInt(r[1]), parseInt(r[2]), arr);
                            result.push(rr);
                        break;
                        case "explode":
                            var rr = AdvancedChance.explode(parseInt(r[1]), parseInt(r[2]), arr);
                            result.push(rr);
                        break;
                        case "drop":
                            var rr = AdvancedChance.drop(parseInt(r[1]), parseInt(r[2]), parseInt(r[4]), r[3], arr);

                            var sum = 0;
                            for (let i of rr) sum += i;

                            result.push(sum);
                        break;
                        case "keep":
                            var rr = AdvancedChance.keep(parseInt(r[1]), parseInt(r[2]), parseInt(r[4]), r[3], arr);

                            var sum = 0;
                            for (let i of rr) sum += i;

                            result.push(sum);
                        break;
                        case "diceOp":
                            var rr = AdvancedChance.xdx_if(parseInt(r[1]), parseInt(r[2]), r[3], parseInt(r[4]), arr);
                            result.push(rr);
                        break;
                        case "dice":
                            var rr = AdvancedChance.xdx(parseInt(r[1]), parseInt(r[2]), arr);
                            result.push(rr);
                        break;
                        case "fudge":
                            var rr = AdvancedChance.xdx_custom(parseInt(r[1]), [0,0,1,1,-1,-1], arr);
                            result.push(rr);
                        break;
                        case "rangef1":case "rangef2":case "rangef3":
                            var rr = AdvancedChance.float(parseFloat(r[1]), parseFloat(r[2]));
                            result.push(rr);
                        break;
                        case "range":
                            var rr = AdvancedChance.int(parseInt(r[1]), parseInt(r[2]));
                            result.push(rr);
                        break;
                        case "number":
                            result.push(parseFloat(r[1]));
                        break;
                        default:
                            result.push(r[1]);
                    }

                    str = str.substring(r[0].length);
                    break;
                }   
            }

            if (!r) {
                str = str.substring(1);
            }
        }

        return RPG.calc(result);
    }

    static calc(arry, vars={}) {
        if (arry.length == 0) return NaN;

        function fact() {
            var c = arry.shift(); 
            if (typeof(c) === "number") {
                return c;
            } else if (vars[c] != undefined) {
                return parseFloat(vars[c]);
            }

            if (c === "(") {
                c = cond();
                if (arry.shift() !== ")") throw "invalid expr";
                return c;
            }

            throw "invalid expr";
        }

        function term() {
            var c = fact();
            while (arry[0] === '*' || arry[0] === '/' || arry[0] == '%' || arry[0] == '^') {
                var o = arry.shift();
                if (o === '*') c = c * term();
                if (o === '/') c = c / term();
                if (o === '%') c = c % term();
                if (o === '^') c = Math.pow(c, term());
            }
            return c;
        }

        function expr() {
            var c = term();
            while (arry[0] == '+' || arry[0] == '-') {
                var o = arry.shift();
                if (o === '+') c = c + term();
                if (o === '-') c = c - term();
            }
            return c;
        }

        function cond() {
            var c = expr();
            while (arry[0] == '<' || arry[0] == '>' || arry[0] == "<=" || arry[0] == ">=" || arry[0] == "==" || arry[0] == "!=") {
                var o = arry.shift();
                if (o === "==") c = c == expr();
                if (o === "!=") c = c != expr();
                if (o === '<') c = c < expr();
                if (o === "<=") c = c <= expr();
                if (o === '>') c = c > expr();
                if (o ===  ">=") c = c >= expr();
            }
            return c;
        }

        return cond();
    }
}