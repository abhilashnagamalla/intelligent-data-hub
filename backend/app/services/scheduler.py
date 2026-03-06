from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.services.data_service import run_full_sync
from app.database import AsyncSessionLocal


async def weekly_sync():

    async with AsyncSessionLocal() as db:
        await run_full_sync(db)


def start_scheduler():

    scheduler = AsyncIOScheduler()

    scheduler.add_job(
        weekly_sync,
        "cron",
        day_of_week="sun",
        hour=3,
        minute=0
    )

    scheduler.start()