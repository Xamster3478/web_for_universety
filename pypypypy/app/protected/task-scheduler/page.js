'use client';

import React, { useEffect, useState } from 'react'; // Убедитесь, что useState импортирован
import { useRouter } from 'next/navigation';
import TaskScheduler from './task-scheduler';

const ProtectedPage = () => {
    return (
        <div>
            <TaskScheduler />
        </div>
    );
};

export default ProtectedPage;