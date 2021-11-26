import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseStats } from "src/entities/baseStats.entity";
import { StatsOneOnOne } from "src/entities/statsOneOnOne.entity";
import { StatsTwoOnTwo } from "src/entities/statsTwoOnTwo.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserStatsService {
    constructor(
        @InjectRepository(BaseStats) private readonly baseStatsRepository: Repository<BaseStats>,
        @InjectRepository(StatsOneOnOne) private readonly statsOneOnOneRepository: Repository<StatsOneOnOne>,
        @InjectRepository(StatsTwoOnTwo) private readonly statsTwoOnTwoRepository: Repository<StatsTwoOnTwo>,
    ) { }

    async createBaseStats(id: string) {
        const bs = new BaseStats();
        bs.id = id;
        return await this.baseStatsRepository.save(bs);
    }

    async createStatsOneOnOne(id: string, baseStatsId: string) {
        const ooo = new StatsOneOnOne();
        ooo.id = id;
        ooo.baseStatsId = baseStatsId;
        return await this.statsOneOnOneRepository.save(ooo);
    }

    async createStatsTwoOnTwo(id: string, baseStatsId: string) {
        const tot = new StatsTwoOnTwo();
        tot.id = id;
        tot.baseStatsId = baseStatsId;
        return await this.statsTwoOnTwoRepository.save(tot);
    }
}
