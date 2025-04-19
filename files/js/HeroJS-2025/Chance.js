// lighter version of the normal chance
// see AdvanceChance for details

class Chance {
    static generator = Math.random;

    // Official HeroJS 3 (tested)
    // int v0.0.2
    // returns a value between low and high including
    static int(low, high) {
        low = parseInt(low);
        high = parseInt(high);

        return Math.floor(Chance.generator() * (high - low + 1) + low);
    }

    // Official HeroJS 3 (tested)
    // float v0.0.2
    // returns a float value between low and high including, also can set fixed decimal value 
    static float(low, high, fixed=4)
    {
        low = parseFloat(low);
        high = parseFloat(high);

        return parseFloat(
            (Chance.generator() * (high - low) + low)
            .toFixed(fixed)
        );
    }

    // Official HeroJS 3 (tested)
    // coin v0.0.2
    // returns 0 or 1
    static coin() {
        return Math.floor(Chance.generator() * 2);
    }

    // Official HeroJS 3 (tested)
    // outof v0.0.2
    // returns true or false based on 1 out of chance
    static outof(chance) {
        return Math.floor(Chance.generator() * chance) == 0;
    }

    // Official HeroJS 3 (tested)
    // chance v0.0.2
    // returns true or false based on % chance 
    static chance(n) {
		return Chance.generator() <= (n * 0.01);
	}

    // Official HeroJS 2
    // pickers v0.0.3
    static pickFromArray(pool) {
        return pool[Math.floor(Chance.generator() * pool.length)];
    }

    static index(len) {
        return Math.trunc(Chance.generator() * len);
    }

    static pickFromObject(pool) {
        return pool[Chance.pickFromArray(Object.keys(pool))];
    }

    static pick(pool) {
        if (Array.isArray(pool))
            return Chance.pickFromArray(pool);
        else if (pool instanceof Object)
            return Chance.pickFromObject(pool);
        return pool;
    }

    // Official HeroJS 2
    // falsy v0.0.1
    static falsy(pool) {
        const arr = pool || [false, null, undefined, 0, NaN, ''];
        return Chance.pickFromArray(arr);
    }

    // Official HeroJS 2
    // character v0.0.2
    static alpha() {
        return Chance.pickFromArray("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }

    static digit() {
        return Chance.pickFromArray("0123456789");
    }

    static alnum() {
        return Chance.pickFromArray("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
    }

    static lower() {
        return Chance.pickFromArray("abcdefghijklmnopqrstuvwxyz");
    }

    static upper() {
        return Chance.pickFromArray("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }

    static symbol() {
        return Chance.pickFromArray("!@#$%^&*()");
    }

    static hex() {
        return Chance.pickFromArray("ABCDEF0123456789");
    }

    static operator() {
        return Chance.pickFromArray("+-*/%^");
    }

    static string(len, type)
    {
        var result = "";
        while (len > 0) {
            result += Chance.character(undefined, type);
            --len;
        }
        return result;
    }

    static character(chars, type = "all") {
        switch (type) {
            case "all": default:
                if (chars != undefined) return Chance.pickFromArray(chars);
                return Chance.pickFromArray("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
            case "alpha":
                return Chance.alpha();
            case "digit":
                return Chance.digit();
            case "alnum":
                return Chance.alnum();
            case "lower":
                return Chance.lower();
            case "upper":
                return Chance.upper();
            case "symbol":
                return Chance.symbol();
            case "hex":
                return Chance.hex();
            case "operator":
                return Chance.operator();
        }
    }

    // Official HeroJS 2
    // natural v0.0.2
    static natural(low, high, exclude)
    {
        if (exclude) {
            const arr = [];
            while (low < high) {
                var e = exclude.indexOf(low);
                if (e == -1) {
                    arr.push(low);
                } else {
                    exclude.splice(e, 1);
                }
                ++low;
            }
            return Chance.pickFromArray(arr);
        }
        return Chance.int(low, high);
    }

    // Official HeroJS 2
    // weighted random v0.0.1
    // key = value
    // value = weight
    static weighted(spec) {
        var i, sum=0, r=Chance.generator();
        for (i in spec) {
            sum += spec[i];
            if (r <= sum) return i;
        }
        return i;
    }

    // Official HeroJS
    // simple dice
    static d4() {
        return Chance.int(1, 4);
    }

    static d6() {
        return Chance.int(1, 6);
    }

    static d8() {
        return Chance.int(1, 8);
    }

    static d10() {
        return Chance.int(1, 10);
    }

    static d12() {
        return Chance.int(1, 12);
    }

    static d20() {
        return Chance.int(1, 20);
    }

    static d30() {
        return Chance.int(1, 30);
    }

    static d100() {
        return Chance.int(1, 100);
    }

    static die(n) {
        return Chance.int(1, n);
    }

    static fate() {
        return Chance.pickFromArray([0,0,1,1,-1,-1]);
    }

    static vs(a, b, v) {
        return a + this.generator() * v > b + this.generator() * v ? 0 : 1;
    }
}