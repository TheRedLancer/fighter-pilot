# All Events and payloads

## gameStart
    {
        
    }

## gameOver
    {
        message: string
    }

## inputListener
    {
        keyCode: int,
        isPressed: bool,
        inputs[keyCode]: bool
    }

## bulletCollision
    {
        see https://threejs.org/docs/#api/en/core/Raycaster
    }

## blockHit
    {
        block: Block
    }

## playerCollision
    {
        player: Player
        other: Component
    }