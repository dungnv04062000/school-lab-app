import React from 'react'
import './activity-statistics.scss'
import { AppBarChart } from '../../../components/common/Chart/BarChart'
import FilterActivityStatistic from '../../../components/common/filter/filter-teacher/activity-statistics'
import LayoutHomeAdmin from '../../../components/layouts/adminLayout'
import AppDoughnutChart from '../../../components/common/Chart/DoughnutChart'

export default function ActivityStatisticStudent() {
    return (
        <LayoutHomeAdmin
            content={
                <div className='activity-statistics'>
                    <FilterActivityStatistic />
                    <div className='bar-chart'>
                        <AppBarChart />
                    </div>

                    <div className='doughnut-chart'>
                        <AppDoughnutChart />
                    </div>

                </div>
            }
        />
    )
}
