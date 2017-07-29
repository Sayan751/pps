/*
NNF schema:
    1. Negation symbol in front of variable is only allowed.
    2. A group of literal connected with connectives is in NNF.
        2.1. A clause can be a group (clause can be both disjunctive and conjunctive)
        2.2. A group is a collection of clause and literals.
        2.3. Every group has homogeneous connective.
             Every group needs to be formed as per boolean binding rule.
    3. A literal is in NNF.
    4. A NNF can either be a literal or a group (as describe above).
*/
export class NNF {

}