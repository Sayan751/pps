# Propositional Proof System (PPS) #

This repository provides well tested implementations of some satisfiability algorithms for propositional formulas.

[![Build Status](https://travis-ci.org/Sayan751/pps.svg?branch=master)](https://travis-ci.org/Sayan751/pps)
[![codecov](https://codecov.io/gh/Sayan751/pps/branch/master/graph/badge.svg)](https://codecov.io/gh/Sayan751/pps)

[![NPM](https://nodei.co/npm/pps2.png)](https://nodei.co/npm/pps2/)

* [Getting Started](#getting-started)
* [Propositional Formulas](#propositional-formulas)
* [Implemented Satisfiability Algorithms](#implemented-satisfiability-algorithms)
  * [Truth Table](#truth-table)
  * [Independent Set](#independent-set)
  * [2-SAT](#2-sat)
* [Check satisfiability of `CNF` object directly](#check-satisfiability-of-cnf-object-directly)

## Getting Started ##

Install the package using

```node
npm install --save pps2
```

Yes, there is an existing npm package `pps` :broken_heart:

Use it in your code as follows.

```javascript
// using require
const pps2 = require("pps2");
pps2.TruthTableSATChecker.isSat("x and notx"); // false
pps2.TruthTableSATChecker.isSat("x or notx"); // true

// or using ES6 import
import { TruthTableSATChecker } from "pps2";
TruthTableSATChecker.isSat("x and notx"); // false
TruthTableSATChecker.isSat("x or notx"); // true
```

## Propositional Formulas ##

As said above, this repository provides implementations of some satisfiability algorithms of propositional formulas, it expects the input formulas to be in [CNF](https://en.wikipedia.org/wiki/Conjunctive_normal_form).
Some valid examples of CNF are x &#8743; y, x &#8744; y, (x &#8744; y) &#8743; (&#172;x &#8744; &#172;y), etc.
Only the following connectives in the formula are supported:

* AND (&#8743;)
* OR (&#8744;)
* NOT (&#172;)

_Implication, and equivalence in the formula are not supported, and such formulas need to be converted to [NNF](https://en.wikipedia.org/wiki/Negation_normal_form) first._

Input formula can be a string or a `CNF` object.

### Formulas in textual forms ###

If the formula is a string then it needs to be in any of these following forms:

* (x &#8744; y) &#8743; (&#172;x &#8744; &#172;y) - using unicode chars
* (x OR y) AND (NOTx OR NOTy) - using textual forms (connectives are case insensitive; i.e. AND, and, or AnD refers same 'AND' connective).
* (x || y) && (!x || !y)

It also supports mixed forms such as (x OR y) &#8743; (NOTx &#8744; &#172;y) :confused: (yes, there are test cases for that :grin:), however doing so only affects the readability.

Any formula in textual form can be parsed to a `CNF` object. Example:

```javascript
import {CNF} from "pps2";
const cnf: CNF = CNF.parse("x and notx");
```

### Formulas as `CNF` object ###

Alternatively, you can instantiate a CNF object directly.
As a `CNF` is a conjunction of `Clause`(s), which are in turn disjunction of `Literal`(s), to instantiate a `CNF` object needs more or less instantiating all three classes. Below is a minimal example to instantiate x &#8743; &#172;x.

```javascript
import {Clause, CNF, Literal} from "pps2";
const cnf: CNF = new CNF([
    new Clause([new Literal("x")]), // x
    new Clause([new Literal("x", true)]) // not x
]);
```

The signature of `Literal`'s `ctor` is as follows:

```javascript
// by default all literals as positive if not specified otherwise
constructor(variable: string, isNegative: boolean = false);
```

Another slightly complex example of instantiating (x &#8744; &#172;y) &#8743; (&#172;x &#8744; y):

```javascript
import {Clause, CNF, Literal} from "pps2";
const cnf: CNF = new CNF([
    new Clause([new Literal("x"), new Literal("y", true)]), // (x OR NOTy)
    new Clause([new Literal("x", true), new Literal("y")])  // (NOTx OR y)
]);
```

Though these examples looks more complex than simply parsing a textual formula, these constructors can be very useful to programmatically construct any arbitrary formula (how do you think the textual formulas are parsed:wink:).

## Implemented Satisfiability Algorithms ##

In the basic form the satisfiability algorithms decide whether a propositional formula, in `CNF`, is satisfiable or not.
These algorithms are implemented in their separate classes, which has a common function `isSat` with following signature.

```javascript
isSat(cnf: CNF | string): boolean;
```

### Truth Table Algorithm ###

Truth table is the most basic algorithm for satisfiability checking.
If there are `n` variables in the `CNF` then in worst case, this algorithm will try all 2<sup>n</sup> binary combinations (truth assignments) for the formula.
However, it returns true as soon as the first satisfying truth assignment is found.

Example:

```javascript
import { TruthTableSATChecker } from "pps2";

// unsatisfiable; returns false after trying all 8 truth assignments:
TruthTableSATChecker.isSat("x AND (NOTx OR y) AND (NOTy OR z) AND NOTz");

// tautology(always satisfiable); returns true after trying only 1 truth assignment:
TruthTableSATChecker.isSat("x OR NOTx");
```

Additionally, `TruthTableSATChecker` can also return the satisfiable model for a given propositional formula in `CNF`.
Example:

```javascript
TruthTableSATChecker.getModel("x or notx"); // [ Map { 'x' => false }, Map { 'x' => true } ]
```

### Independent Set Algorithm ###

The basic idea of independent set algorithm is to count the number of unsatisfying truth assignments.
If the count is 2<sup>n</sup> for a formula with `n` variable then the formula is unsatisfiable.

Example:

```javascript
import { IndependentSetSATChecker } from "pps2";

IndependentSetSATChecker.isSat("x AND (NOTx OR y) AND (NOTy OR z) AND NOTz"); //false

IndependentSetSATChecker.isSat("x OR NOTx"); //true
```

## 2-SAT ##

This algorithm first transforms every clause in CNF to implication form.
Form the implication forms, it generates a directed graph, and concludes the formula to unsatisfiable if the graph contains a [strongly connected component (SCC)](https://en.wikipedia.org/wiki/Strongly_connected_component), with complimentary pair of literals in it.

```javascript
import { TwoSATChecker } from "pps2";

// use a string
TwoSATChecker.isSat("x AND NOTx"); //false

//or use a CNF object
TwoSATChecker.isSat(new CNF(...));
```

## Check satisfiability of `CNF` object directly ##

To make things semantically pleasing, `CNF` also exposes a `isSat` method with the help duck typing of SAT checkers (`SATChecker`).
This means that you can do following:

```javascript
const cnf = new CNF([...]);

// CNF#isSat signature: isSat(satChecker: SATChecker): boolean
// so we need to pass the algorithm we want use:

cnf.isSat(TruthTableSATChecker);
// OR
cnf.isSat(IndependentSetSATChecker);
```

Neat!

More features will be added soon (hopefully :stuck_out_tongue:).

Have fun :relaxed: