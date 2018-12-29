import Sanctuary from 'sanctuary'
import type from 'sanctuary-type-identifiers'
import $ from 'sanctuary-def'
import { isObject, isDeepStrictEqual } from 'util';

const ListType = $.UnaryType
    ('Uprising/List')
    ('http://example.com/my-package#Integer')
    (x => (type(x) === 'Uprising/List'))
    (list => list.value)

const env = Sanctuary.env.concat([ListType($.Unknown)])

const S = Sanctuary.create ({
    checkTypes: true,
    env,
});

function List(generator, arr, length) {
    this[Symbol.iterator] = generator
    this.value = arr || this.value
    this.length = length
}

List['@@type'] = 'Uprising/List'
List['fantasy-land/empty'] = function() {
    return list()
}

const list = (...args) => {
    return new List(function* () {
        yield* args
    }, args, args.length)
}

const fromArray = array => {
    return new List(function* () {
        yield* array
    }, array, array.length)
}

const l = (...args) => {
    return args.length === 1 && Array.isArray(args[0])
        ? fromArray(args[0])
        : (args === undefined 
            ? list () 
            : list (...args) )
}

const isNull = list => list.length === 0

const toArray = list => [...list]

const map = fn => list => {
    const gen = list[Symbol.iterator]
    return new List(function* () {
        for (const val of gen()) {
            yield fn(val)
        }
    }, list.value, list.length)
}

const filter = predicate => list => {
    const gen = list[Symbol.iterator]
    return new List(function* () {
        for (const val of gen()) {
            if (predicate (val)) yield val
        }
    }, list.value, list.length)
}

const head = list => {
    const head = list[Symbol.iterator]().next()
    if (head.done) throw new Error("Calling head on an empty list")
    return head.value
}

const tail = list => {
    if (isNull (list)) throw new Error("Calling tail on an empty list")
    const gen = list[Symbol.iterator]
    return new List(function* () {
        const iterator = gen();
        iterator.next();
        yield* iterator;
    }, list.value, list.length - 1);
}

const foldl = fn => acc => list => {
    return isNull (list)
        ? acc
        : foldl (fn)
                (fn (acc) (head (list)) )
                (tail (list) )
}

const foldr = fn => acc => list => {
    return isNull (list)
        ? acc
        : fn (head(list))
             (foldr (fn) (acc) (tail(list) ))
}

const get = index => list => {
    if (index >= list.length) throw new Error("Index too large")
    const iterator = list[Symbol.iterator]()
    let targetEl, currentIndex = 0
    let currentEl = iterator.next()
    while (!targetEl && currentIndex !== list.length) {
        if (currentIndex === index) targetEl = currentEl.value
        currentEl = iterator.next()
        currentIndex = currentIndex + 1
    }
    return Array.isArray(targetEl) ? fromArray(targetEl) : targetEl
}

const take = num => list => {
        if (num > list.length) return list
        const gen = list[Symbol.iterator]
        let index = 0
        const newList = new List(function* () {  
            const iterator = gen();
            let el = iterator.next()
            while (!el.done && index < num) {
                yield el.value
                index++
                el = iterator.next()
            }
        }, list.value, num);
        return newList
}

const drop = num => list => {
        if (num > list.length) return list
        const gen = list[Symbol.iterator]
        let index = 0
        const newList = new List(function* () {  
            const iterator = gen();
            let el = iterator.next()
            while (!el.done) {
                if (index > num - 1) yield el.value
                el = iterator.next()
                index = index + 1
            }
        }, list.value, list.length - num);
        return newList
}

const concat = list1 => list2 => {
    const gen = list1[Symbol.iterator]
    const totalLength = list1.length + list2.length
    return new List(function* () {
        yield* gen()
        yield* list2
    }, list1.value, totalLength)
}

const takeWhile = fn => ls => {
    if (ls.length === 0) return ls 
    const headEl = head (ls)
    return fn (headEl)
        ? concat (list(headEl)) (takeWhile (fn) (tail(ls) )) 
        : list()
}

const dropWhile = fn => ls => {
    return ls.length === 0
        ? list()
        : fn ( head (ls) ) 
            ? dropWhile (fn) ( tail (ls) )
            : ls
}

const last = list => {
    if (isNull (list)) throw new Error("Empty list")
    return get (list.length - 1) (list)
}

const cons = el => ls => {
    const elList = fromArray([el])
    return concat (elList) (ls)
}

const flip = fn => x => y => fn (y) (x)
const reverse = foldl (flip (cons)) (list())
const sum = foldl (x => y => x + y) (0)
const product = foldl (x => y => x * y) (1)

const and = list => {
    const gen = list[Symbol.iterator]
        const iterator = gen();
        let el = iterator.next()
        let result = true
        while (!el.done) {
            if (el.value === false) {
                result = false
                break
            }
            el = iterator.next()
        }
    return result
}

const or = list => {
    const gen = list[Symbol.iterator]
        const iterator = gen();
        let el = iterator.next()
        let result = false
        while (!el.done) {
            if (el.value === true) {
                result = true
                break
            }
            el = iterator.next()
        }
    return result
}

const all = fn => list => {
    const gen = list[Symbol.iterator]
    const iterator = gen();
    let el = iterator.next()
    let result = true
    while (!el.done) {
        if (fn (el.value) === false) {
            result = false
            break
        }
        el = iterator.next()
    }
    return result
}

const any = fn => list => {
    const gen = list[Symbol.iterator]
        const iterator = gen();
        let el = iterator.next()
        let result = false
        while (!el.done) {
            if (fn (el.value) === true) {
                result = true
                break
            }
            el = iterator.next()
        }
    return result
}

const equals = dt1 => dt2 => {
    if (type(dt1) !== type(dt2)) throw new Error("At least one of the provided arguments is not a list")
    if (type(dt1) === 'Uprising/List') {
        if (dt1.length !== dt2.length) return false
        if (dt1.length === 0) return true
        else return equals (head (dt1)) (head (dt2)) 
            && (isNull(dt1) ? true : equals (tail (dt1)) (tail (dt2)) )
    }
    if (isObject(dt1) && dt1['fantasy-land/equals']) return dt1['fantasy-land/equals'](dt2)
    return isDeepStrictEqual(dt1, dt2)
}

export {
    l,
    toArray,
    map,
    filter,
    head,
    tail,
    foldl,
    foldr,
    get,
    take,
    drop,
    concat,
    takeWhile,
    dropWhile,
    last,
    cons,
    flip,
    reverse,
    sum,
    product,
    and,
    or,
    all,
    any,
    equals
}