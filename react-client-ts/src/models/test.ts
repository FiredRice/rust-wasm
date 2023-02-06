import { toString } from 'class-formatter';

class Test {
    @toString('张三')
    name!: string;
}

export default Test;