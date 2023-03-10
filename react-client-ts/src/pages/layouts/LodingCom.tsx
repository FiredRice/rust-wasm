import React from 'react';
import { Spin } from 'antd';

const LodingCom: React.FC<any> = ({ children }) => {

    return (
        <Spin spinning className='main-center'>
            {children}
        </Spin>
    );
};

export default LodingCom;
