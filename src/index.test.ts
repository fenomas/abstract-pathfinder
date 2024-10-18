import { describe, it } from 'node:test'
import { strictEqual, throws } from 'node:assert'
import { Pathfinder } from '.'

describe('abstract pathfinding on strings', () => {
  /**
   * Paths through this notional graph:
   *
   *   A-B-C<--F
   *     | |
   *     +-D-E
   */

  const paths = {
    A: { B: 1 },
    B: { A: 1, C: 1, D: 1.5 },
    C: { B: 1, D: 1 },
    D: { B: 1.5, C: 1, E: 1 },
    E: { D: 1 },
    F: { C: 1 },
  } as Record<string, Record<string, number>>
  const getFinder = () =>
    new Pathfinder<string>({
      nodeToPrimitive: (node) => node,
      getNeighbors: (node) => Object.keys(paths[node]),
      getMoveCost: (a, b) => paths[a][b] || -1,
      getHeuristic: () => 5,
    })

  it('should find a path', () => {
    const path = getFinder().findPath('A', 'E')
    strictEqual(path.join(''), 'ABDE')
  })

  it('should find a reversed path', () => {
    const path = getFinder().findPath('E', 'A')
    strictEqual(path.join(''), 'EDBA')
  })

  it('should return an empty array for no path', () => {
    const path = getFinder().findPath('D', 'F')
    strictEqual(path.join(''), '')
  })

  it('should work with a one-way path', () => {
    const path = getFinder().findPath('F', 'E')
    strictEqual(path.join(''), 'FCDE')
  })

  it('should throw for infinite loops', () => {
    const finder = new Pathfinder<number>({
      getNeighbors: (node) => [node + 1],
    })
    finder.maxIterations = 100
    throws(() => finder.findPath(0, -1))
  })
})

describe('abstract pathfinding on objects', () => {
  const map = [
    // 23456789
    '......c...', // 0
    '###b######', // 1
    '.......#..', // 2
    '.......#..', // 3
    '.......#..', // 4
    'a.........', // 5
  ]
  const lookup = (x = 0, y = 0) => {
    if (!map[y]) return '#'
    return map[y][x] || '#'
  }

  const getFinder = () =>
    new Pathfinder<[number, number]>({
      nodeToPrimitive: ([x, y]) => `${x},${y}`,
      getNeighbors: ([x, y]) => [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ],
      getMoveCost: (_, [a, b]) => (lookup(a, b) === '#' ? -1 : 1),
      getHeuristic: ([x, y], [a, b]) => Math.abs(x - a) + Math.abs(y - b),
    })

  it('should find a path', () => {
    const path = getFinder().findPath([0, 5], [9, 0])
    strictEqual(path.length, 15)
    const str = path.map(([x, y]) => lookup(x, y)).join('')
    strictEqual(str, 'a......b...c...')
  })

  it('should find a reverse path', () => {
    const path = getFinder().findPath([9, 0], [0, 5])
    strictEqual(path.length, 15)
  })

  it('should return an empty array for no path', () => {
    const path = getFinder().findPath([0, 5], [10, 0])
    strictEqual(path.length, 0)
  })
})
