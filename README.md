[![CircleCI](https://circleci.com/gh/housecrow/func-list/tree/master.svg?style=svg)](https://circleci.com/gh/housecrow/func-list/tree/master)

# Description

This package provides lists with lazy, semi-lazy and strict functions. It leverages ES2015's iterators and generators to implement the laziness aspect.

## Motivation

The main reason that I've started this project was that I've worked with a backend platform that uses a JVM-based Javascript engine (Nashorn) which exposes many functions in the API whose return values are iterators. I wanted to have a functional interface that wraps these iterators (hence the functional part of the project), but without iterating over the whole iterator if not necessary (hence the lazienss part). So the project has started with a wrapper for JAVA(ish)-iterators in mind but then I thought of bringing it to javascript arrays.

That was a nice story, now to the main reason to why I've really started the project:
Well, I love functional programming and lazy evaluation, you can't hate me for that :).

If you need lazy lists with a functional interface, this package is right for you.

## Implemented algebraic structures

The package currently implements the following algebraic structures:

- Functor
- Semigroup
- Setoid
- Foldable
- Monoid

## Installation

```javascript
npm i @housecrow/func-list
```

## API Documentation

For every function a haskellish signature as well as a javascript signature(with a further explanation) will be provided.

## Constructor

```javascript
import { l } from "@housecrow/func-list";
const myList = l(1, 2, 3);
const myList2 = l([1, 2, 3]);
```

As you can see in the above code block the constructor can take the list elements either as seperate arguments or as an array containing the elements.

## Functions

Some points that are worth mentioning:

- All the functions and their function-arguements are curried.
- Most of the functions that return another list are lazy.
- Generally speaking the functions that result into a new list that has another length than the list that has been provided as an argument are not lazy.
- Every function has a 'laziness' indicator showing the level of laziness, the levels are 'lazy', 'semi-lazy' and 'none'(strict).

### map

Laziness: _lazy_

`map :: (a -> b) -> [a] -> [b]`

#### JS signature

`map (x => y) (list)`

#### Parameters

`x => y` A function that takes a value 'x' and returns a value 'y'.\
`list` of type _List_ A list to operate on.

#### Description

Returns a new list that is the result of applying the function that is passed as the first argument
to all items in the list passed as the second argument.

### filter

Laziness: _none_

`filter :: (a -> Bool) [a] -> [a]`

#### JS signature

`filter (x => bool) (list)`

#### Parameters

`x => bool` A function that takes a value 'x' and returns a value of type _Boolean_.\
`list` of type _List_.

#### Description

Takes a predicate(boolean function) and a list and returns a new list whose elements fulfuill the condition in the predicate.

### foldl

Laziness: _semi-lazy_

`foldl :: (b -> a -> b) -> b -> [a] -> b`

#### JS signature

`foldl (x => y => z) (v) (List)`

#### Parameters

`x => y => z` A function that takes a value 'x' and a value 'y' and returns a value 'z'.\
`v` A value 'v'.\
`List` A list to operate on.

#### Description

Takes the first item of the list and and the second argument and applies the function to them, then calls the function with this result and the second item in the list and so on.

### head

Laziness: _none_

`head :: [a] -> a`

#### JS signature

`head (list)`

#### Parameters

`list` of type _List_.

#### Description

Returns the first element in the list. Throws an error when called on an empty list.

### tail

Laziness: _lazy_

`tail :: [a] -> [a]`

#### JS signature

`tail (list)`

#### Parameters

`List` of type _List_.

#### Description

Returns a list with all the elements in the list provided as the argument except for the first element.
When called on an empty list it throws an error.
When called on a singelton-list it returns an empty list.

### get

Laziness: _none_

`get :: (Num a) -> a -> [b] -> b`

#### JS signature

`get (index) (list)`

#### Parameters

`index` of type _Number_.\
`list` of type _List_.

#### Description

Takes an index and a list and returns the element at the specified index.

### take

Laziness: _lazy_

`take :: Int -> [a] -> [a]`

#### JS signature

`take (num) (list)`

#### Parameters

`num` of type _Number_.\
`list` of type _List_.

#### Description

Returns a new list, the first argument speicifies how many items will be taken from the list passed as the second argument.

### drop

Laziness: _lazy_

`drop :: Int -> [a] -> [a]`

#### JS signature

`drop (num) (list)`

#### Parameters

`num` of type _Number_.\
`list` of type _List_.

#### Description

Returns a subllist constructed from the list provided as the second argument, the first argument speicifies how many items will be ignored.

### concat

Laziness: _lazy_

`concat :: [a] -> [a] -> [a]`

#### JS signature

`concat (list1) (list2)`

#### Parameters

`list1` of type _List_.\
`list2` of type _List_.

#### Description

Returns a new list that is constrcuted from the concatenation of the two provided lists.

### last

Laziness: _none_

`last :: [a] -> a`

#### JS signature

`last (list1) (list2)`

#### Parameters

`list` of type _List_.\

#### Description

Returns the last element in the list.Throws an error when called on an empty list.

### cons

Laziness: _lazt_

`cons :: a -> [a] -> [a]`

#### JS signature

`cons (x) (list)`

#### Parameters

`x` a value 'x'.\
`list` of type _List_.

#### Description

Returns a new list that is the result of preapending 'x' to the provided list.

### reverse

Laziness: _lazy_

`reverse :: [a] -> [a]`

#### JS signature

`reverse (list)`

#### Parameters

`list` of type _List_.

#### Description

Returns a new list containg the elements in the provided list in the reverse order.

### sum

Laziness: _semi-lazy_

`sum :: [a] -> a`

#### JS signature

`sum (list)`

#### Parameters

`list` of type _List_.

#### Description

Returns the sum of all the elements in the provided list. when called on an empty list the result is 0.

### product

Laziness: _semi-lazy_

`product :: [a] -> a`

#### JS signature

`product (list)`

#### Parameters

`list` of type _List_.

#### Description

Returns the product of all the elements in the provided list. when called on an empty list the result is 1.

### all

Laziness: _none_

`all :: (a -> Bool) -> [a] -> Bool`

#### JS signature

`all (x => Boolean) (list)`

#### Parameters

`x => Boolean` a predicate function.\
`list` of type _List_.

#### Description

Returns true if all the elements in the provided list fulfill the predicate.

### any

Laziness: _none_

`all :: (a -> Bool) -> [a] -> Bool`

#### JS signature

`any (x => Boolean) (list)`

#### Parameters

`x => Boolean` a predicate function.\
`list` of type _List_.

#### Description

Returns true if any of the elements in the provided list fulfill the predicate.

### and

Laziness: _none_

`all :: (a -> Bool) -> [a] -> Bool`

#### JS signature

`and (x => Boolean) (list)`

#### Parameters

`x => Boolean` a predicate function.\
`list` of type _List Boolean_.

#### Description

Returns true if all the boolean values in the provided list are true.

### or

Laziness: _none_

`all :: (a -> Bool) -> [a] -> Bool`

#### JS signature

`and (x => Boolean) (list)`

#### Parameters

`x => Boolean` a predicate function.\
`list` of type _List Boolean_.

#### Description

Returns true if at least one of the boolean values in the provided list is true.

Undocumented functions:

- equals
- min
- max
- minimum
- maximum
- length
- splitAt
- chain
- zipWith
