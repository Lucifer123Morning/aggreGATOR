
CREATE TABLE IF NOT EXISTS public.feeds (
                                            id BIGSERIAL PRIMARY KEY,
                                            name TEXT NOT NULL,
                                            url TEXT NOT NULL,
                                            user_id BIGINT NOT NULL,
                                            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

ALTER TABLE public.feeds
    ADD CONSTRAINT feeds_user_id_users_id_fk
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

